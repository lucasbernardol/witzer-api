import type { PartialModelObject, ModelClass, ModelObject } from 'objection';
import { NotFound } from 'http-errors';

import { Link } from '../models/link.model';
import { LinkTypes } from '../models/interfaces/link-model.interface';
//import type { LinkTypes } from '../models/interfaces/link-model.interface';

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

  async withHashOrSlug(hashOrSlug: string): Promise<LinkTypes> {
    const _where: PartialModelObject<Link> = {
      hash: hashOrSlug,
      deleted_at: null,
    };

    const _orWhere: PartialModelObject<Link> = {
      slug: hashOrSlug,
      deleted_at: null,
    };

    const whitelist = this.model.whitelist();

    const link = await this.model
      .query()
      .select(whitelist)
      .where(_where)
      .orWhere(_orWhere)
      .first()
      .execute();

    if (!link) {
      throw new NotFound(
        `NOT FOUND: Link not found with hash/slug: "${hashOrSlug}"`
      );
    }

    return {
      id: link.id,
      href: link.href,
      redirectings: link.redirectings,
      hash: link.hash,
      _version: link._version,
    } as any;
  }

  async analytics(hash: string, deepEntity: ModelObject<Link>): Promise<void> {
    const queryBuilder = this.model.query(); // Object query builder.

    await queryBuilder.update({
      activated_at: Date.now(),
      redirectings: deepEntity?.redirectings + 1,
      _version: Number.parseInt(deepEntity._version as any) + 1,
    });
  }
}

const linkServices = LinkServices.get();

export { linkServices as LinkServices };
