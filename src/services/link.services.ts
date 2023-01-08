import type {
  PartialModelObject,
  ModelClass,
  ModelObject,
  QueryBuilder,
} from 'objection';

import { NotFound } from 'http-errors';

import dayjs from 'dayjs';
import dayjsUTCPlugin from 'dayjs/plugin/utc';

import { Link } from '../models/link.model';
import { LinkTypes } from '../models/interfaces/link-model.interface';

import { createHashSha512 } from '../utils/crypto/hash.util';

dayjs.extend(dayjsUTCPlugin);

class LinkServices {
  private static instance: LinkServices;

  public static get() {
    if (!this.instance) {
      // new this()
      this.instance = new LinkServices();
    }

    return this.instance;
  }

  private constructor(
    private readonly model: ModelClass<Link> & typeof Link = Link
  ) {}

  private queryBuilder(): QueryBuilder<Link, Link[]> {
    return this.model.query();
  }

  async withHash(hash: string): Promise<LinkTypes> {
    const culums = this.model.whitelist();

    const queryBuilder = this.queryBuilder(); // Object/knex query builder

    const link = await queryBuilder.findOne({ hash }).select(culums).execute();

    if (!link) {
      throw new NotFound(`NOT FOUND: link does not exists.`);
    }

    return {
      id: link.id,
      href: link.href,
      hash: link.hash,
      redirectings: link.redirectings,
      _version: link._version,
    } as any;
  }

  async create({ href, hash }: Partial<LinkTypes>): Promise<Link> {
    const queryBuilder = this.queryBuilder();

    return await queryBuilder.insert({ href, hash }).returning('*').execute();
  }

  async analytics(hash: string, deepEntity: ModelObject<Link>): Promise<void> {
    const queryBuilder = this.model.query(); // Object query builder.

    const _updated: PartialModelObject<Link> = {
      activated_at: dayjs().unix(),
      redirectings: deepEntity?.redirectings + 1,
      _version: Number.parseInt(deepEntity._version as any) + 1,
    };

    await queryBuilder.update(_updated).where({ hash }).execute();
  }

  async hasThrows(plainHash: string): Promise<void> {
    const has = await this.hasHash(createHashSha512(plainHash));

    if (!has) {
      throw new NotFound(`NOT FOUND: link does not exists.`);
    }
  }

  async hasHash(hash: string): Promise<boolean> {
    const columns: Readonly<string[]> = ['id'];

    const queryBuilder = this.queryBuilder();

    const entity = await queryBuilder
      .findOne({ hash })
      .select(columns)
      .execute();

    return !!entity;
  }

  async stats(): Promise<string> {
    const queryBuilder = this.queryBuilder();

    const primaryIdColumn = this.model.idColumn; // Objection "id" column references.

    const [statistics] = await queryBuilder.count(primaryIdColumn).execute();

    const analytics = statistics as unknown as { count: string };

    return analytics.count;
  }
}

const linkServices = LinkServices.get();

export { linkServices as LinkServices };
