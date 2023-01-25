import assert from 'node:assert/strict';

import dayjs from 'dayjs';

// @ts-ignore
import packages from '../../package.json';

assert.ok(packages?.version, '[PACKAGE.JSON]: version field?');

const URI = process.env.HOST; // example: localhost:3333

export type ReplyFunctionResponses<T = any> = {
  $uri: string;
  version: string;
  data?: Partial<T>;
  _meta?: Record<string, any>;
};

export type ReplyFunction = <T = any>(data?: T) => ReplyFunctionResponses<T>;

export const reply: ReplyFunction = (data) => {
  const { version } = packages as { version: string };

  return {
    $uri: URI,
    version,
    data,
    _meta: {
      timestamp: {
        format: 'Unix',
        current: dayjs().unix(),
      },
    },
  };
};
