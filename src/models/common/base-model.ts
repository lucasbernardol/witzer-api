import { Model } from 'objection';

import type {
  ModelOptions,
  QueryContext,
  ModelClass,
  ModelObject,
} from 'objection';

export type EntityClass<T extends Model> = ModelClass<T>;

export type EntityContext<T extends Model> = ModelObject<T>;

//import { knex } from '../../query-builder/knex';

export abstract class Entity extends Model {
  abstract created_at: Date;
  abstract updated_at: Date;

  public constructor() {
    super();
  }

  /**
   * @description Objection hooks
   */
  $beforeUpdate(
    opt: ModelOptions,
    queryContext: QueryContext
  ): void | Promise<any> {
    this.updated_at = new Date().toISOString() as any;
  }
}
