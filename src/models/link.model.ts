import type { ModelOptions, QueryContext } from 'objection';

import tableNames from '../constants/table-names.constants';
import { Entity } from './common/base-model';

export type LinkTypes = {
  id: string;
  href: string;
  hash: string;
  slug?: string | null;
  redirectings: number;
  activated_at: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  _version: number;
};

export class Link extends Entity implements LinkTypes {
  public constructor() {
    super();
  }

  id!: string;
  href!: string;
  hash!: string;
  slug?: string;
  redirectings!: number;
  activated_at!: number;
  created_at!: Date;
  updated_at!: Date;
  deleted_at!: Date | null;
  _version!: number;

  static get idColumn() {
    return 'id';
  }

  static get tableName() {
    return tableNames.link;
  }
}
