import crypto from 'node:crypto';

const SECRET_HMAC = process.env.APP_HASHMAC_SECRET;

type CreateHashFunction = (data: string) => string;

export const createHashSha512: CreateHashFunction = (data) => {
  const hmac = crypto.createHmac('sha512', SECRET_HMAC);

  return hmac.update(data).digest('hex');
};
