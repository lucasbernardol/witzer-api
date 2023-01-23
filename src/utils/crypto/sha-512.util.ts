import crypto from 'node:crypto';

//const SECRET_HMAC = process.env.APP_HASHMAC_SECRET;

type CreateHashFunction = (data: string) => string;

export const sha512: CreateHashFunction = (data) => {
  const hmac = crypto.createHash('sha512');

  return hmac.update(data).digest('hex');
};
