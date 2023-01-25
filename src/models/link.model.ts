import { Model } from '@core/common/model';
import tableNames from '@constants/table-names.constants';

import type { LinkTypes } from './interfaces/link-model.interface';

type LinkTypeRecordKeys = keyof LinkTypes;

export type WhitelistColumns = Readonly<Array<LinkTypeRecordKeys>>;

export class Link extends Model implements LinkTypes {
  static idColumn: string = 'id';
  static tableName: string = tableNames.link;

  id!: string;
  href!: string;
  hash!: string;
  redirectings!: number;
  activated_at!: number;
  created_at!: Date;
  updated_at!: Date;
  _version!: number;

  static whitelist(): WhitelistColumns {
    // prettier-ignore
    return [
			'id',
      'href',
			//'hash',
      'redirectings',
			'activated_at',
			'created_at',
			'updated_at',
      '_version',
		]
  }

  static withHashColumns() {
    // prettier-ignore
    return [
			'id',
			'href',
			'redirectings',
			'_version'
		]
  }
}
