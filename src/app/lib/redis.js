import process from 'node:process';
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URI);
