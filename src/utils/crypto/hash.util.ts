import crypto from 'node:crypto';
import type { BinaryToTextEncoding } from 'node:crypto';

type CreateHashOptions = {
  algorithm: string;
  encoding: BinaryToTextEncoding;
};

type CreateHashFunction = (
  data: string,
  options?: Partial<CreateHashOptions>
) => string;

const CREATE_OPTIONS: Partial<CreateHashOptions> = {
  algorithm: 'sha256',
  encoding: 'hex',
};

const createHash: CreateHashFunction = (data, options = CREATE_OPTIONS) => {
  const { algorithm, encoding } = options as CreateHashOptions;

  return crypto
    .createHash(algorithm)
    .update(data)
    .digest(encoding ?? 'hex');
};

export { createHash };
