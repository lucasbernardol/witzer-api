import type {
  PartialModelObject,
  ModelClass,
  ModelObject,
  QueryBuilder,
} from 'objection';

import { UniqueViolationError } from 'objection';

import { NotFound } from 'http-errors';

import { InternalServerError } from 'http-errors';

import dayjs from 'dayjs';
import dayjsUTCPlugin from 'dayjs/plugin/utc';

import { Link, WhitelistColumns } from '@models/link.model';

import { LinkTypes } from '@models/interfaces/link-model.interface';
import { sha512 } from '@utils/crypto/sha-512.util';

import { nanoid } from '@utils/nanoid.util';

dayjs.extend(dayjsUTCPlugin);

class LinkServices {
  private static instance: LinkServices;
  private readonly model: ModelClass<Link> & typeof Link = Link;

  public static get() {
    if (!this.instance) {
      this.instance = new LinkServices();
    }

    return this.instance;
  }

  private constructor() {}

  private queryBuilder(): QueryBuilder<Link, Link[]> {
    return this.model.query();
  }

  private whitelist(): WhitelistColumns {
    return this.model.whitelist();
  }

  private withHashColumns() {
    return this.model.withHashColumns();
  }

  async withHash(hash: string): Promise<ModelObject<Link>> {
    const queryBuilder = this.queryBuilder(); // Objetion.js/Knex query builder

    const culums = this.withHashColumns();

    const shortened = await queryBuilder
      .findOne({ hash })
      .select(culums)
      .execute();

    if (!shortened) {
      throw new NotFound();
    }

    return {
      id: shortened.id,
      href: shortened.href,
      redirectings: shortened.redirectings,
      _version: shortened._version,
    } as any;
  }

  async create({ href }: Pick<LinkTypes, 'href'>): Promise<ModelObject<Link>> {
    const columns = this.whitelist() as string[];

    let created: Link | null = null;

    let attempts: number = 0;

    let hash: string = '';

    const entity = ({ href, hash }: PartialModelObject<Link>) => {
      return {
        href,
        hash: sha512(hash as string),
      };
    };

    do {
      const queryBuilder = this.queryBuilder();

      try {
        const attemptsIsGretherThanMaxRetries = ++attempts > 3;

        if (attemptsIsGretherThanMaxRetries) {
          throw new InternalServerError(); // Attemps
        }

        console.log(attempts);

        hash = await nanoid();

        const _entity = entity({ href, hash });

        // prettier-ignore
        created = await queryBuilder.insert(_entity).returning(columns).execute();
      } catch (error: any) {
        if (error instanceof UniqueViolationError) {
          // Skip/ignore error (try again);
        } else {
          throw error;
        }
      }
    } while (!created);
    // mapper
    return {
      id: created.id,
      href: created.href,
      hash, // nanoid
      redirectings: created.redirectings,
      activated_at: created.activated_at,
      created_at: created.updated_at,
      updated_at: created.updated_at,
      _version: created._version,
    };
  }

  async analytics(hash: string, deepEntity: ModelObject<Link>): Promise<void> {
    const queryBuilder = this.queryBuilder(); // Objection query builder.

    const _updated: PartialModelObject<Link> = {
      activated_at: dayjs().unix(),
      redirectings: deepEntity?.redirectings + 1,
      _version: Number.parseInt(deepEntity._version as any) + 1,
    };

    await queryBuilder.update(_updated).where({ hash }).execute();
  }

  async fullAnalytics(hash: string) {
    const queryBuilder = this.queryBuilder();

    const deepEntity = (await queryBuilder.findOne({ hash }).execute()) as Link;

    const _updated: PartialModelObject<Link> = {
      activated_at: dayjs().unix(),
      redirectings: deepEntity?.redirectings + 1,
      _version: Number.parseInt(deepEntity._version as any) + 1,
    };

    await queryBuilder.update(_updated).where({ hash }).execute();
  }

  async hasThrows(plainHash: string): Promise<void> {
    const has = await this.hasHash(sha512(plainHash));

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
