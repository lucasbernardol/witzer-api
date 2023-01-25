import process from 'node:process';
import isValidatorURL from 'validator/lib/isURL';

const HOST = process.env.HOST;

const blockDomain = new URL(HOST).host;

type IsURLFunction = (url: string) => boolean;

export const isURL: IsURLFunction = (url) => {
  const isValidURLAddress = isValidatorURL(url, {
    // Prevent redirecting loops (single domain/host).
    host_blacklist: [blockDomain],
  });

  return isValidURLAddress;
};
