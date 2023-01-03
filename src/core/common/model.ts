import { Model as ObjectModel } from 'objection';
import type { ModelOptions, QueryContext } from 'objection';

import dayjs from 'dayjs';
import dayjsUTCPlugin from 'dayjs/plugin/utc';

dayjs.extend(dayjsUTCPlugin);

export abstract class Model extends ObjectModel {
  abstract id: string | number;

  abstract created_at: Date;
  abstract updated_at: Date;
  abstract deleted_at: Date | null;

  /**
   * @description Objection `$beforeUpdate` hook.
   */
  public $beforeUpdate(
    opt: ModelOptions,
    queryContext: QueryContext
  ): void | Promise<any> {
    this.updated_at = dayjs().toISOString() as unknown as Date;
  }
}
