import assert from 'node:assert';

// @ts-ignore
import packages from '../../package.json';

assert.ok(packages?.version, '[PACKAGE.JSON]: version field?');

export type ReplyFunctionResponses<T = any> = {
  version: string;
  body?: Partial<T>;
};

export type ReplyFunction = <T = any>(body?: T) => ReplyFunctionResponses<T>;

export const reply: ReplyFunction = (body) => {
  const { version } = packages as { version: string };

  return {
    version,
    body,
  };
};
