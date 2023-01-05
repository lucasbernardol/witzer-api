import { Model } from '../core/common/model';
import tableNames from '../constants/table-names.constants';

import type { LinkTypes } from './interfaces/link-model.interface';

type LinkTypeRecordKeys = keyof LinkTypes;

export class Link extends Model implements LinkTypes {
  static idColumn: string = 'id';
  static tableName: string = tableNames.link;

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

  static whitelist(): Readonly<Array<LinkTypeRecordKeys>> {
    // prettier-ignore
    return [
			'id',
      'href',
      'redirectings',
      '_version',
		]
  }
}
