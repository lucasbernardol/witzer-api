import type { Request } from 'express';

type CacheKeyFunction = (request: Request) => string;

export const cacheKey: CacheKeyFunction = (request) => {
  const { method, path, baseUrl } = request;

  const queryPropertiesKeys = Object.keys(request.query);

  const queryValues = queryPropertiesKeys.map((key) => {
    const value = request?.query[key] as unknown;

    const valueIsArray = Array.isArray(value);

    if (valueIsArray) {
      return value.toString(); // ['x', 'y'] --> 'z,y'
    }

    return value;
  });

  const query = queryValues.join(',');

  const key = `@cache:${baseUrl}-${path}-${method}-?q=${query}`;

  return key;
};
