import RedisClient from 'ioredis';

export const redisClient = new RedisClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  tls:
    process.env.REDIS_HOST !== 'localhost' &&
    process.env.REDIS_HOST !== '127.0.0.1'
      ? {
          host: process.env.REDIS_HOST,
        }
      : undefined,
});
