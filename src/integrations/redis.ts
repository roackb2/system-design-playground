import { createClient } from 'redis';
import logger from '@/lib/logger';
import { sleep } from '@/lib/utils';
import { PROJ_NS_PREFIX_REDIS } from '@/lib/constants';

export type RedisClientType = ReturnType<typeof createClient>;
export type RedisClientOptions = Parameters<typeof createClient>[0];

const redisClientFactory = (options: RedisClientOptions): RedisClientType => {
  return createClient(options);
};

export const initRedis = async () => {
  const options: RedisClientOptions = {
    url: process.env.REDIS_URL,
    database: parseInt(process.env.REDIS_DATABASE ?? '0')
  }
  logger.info(`Initializing redis with config: ${JSON.stringify(options, null, 2)}`)
  const redisClient = redisClientFactory(options);
  redisClient.on("error", (err: unknown) => {
    logger.error("Redis Client Error:", err);
    if (err instanceof Error) {
      logger.error(`Error message: ${err.message}`);
      logger.error(`Error stack: ${err.stack}`);
    }
  })

  await redisClient.connect();

  while (!redisClient.isReady) {
    logger.info('Redis client not yet ready...');
    await sleep(200);
  }
  logger.info('Redis client ready!');

  return redisClient;
}

export const getKey = (key: string) => `${PROJ_NS_PREFIX_REDIS}:${key}`;
