import { createClient } from 'redis';
import logger from '@/lib/logger';
import { sleep } from '@/lib/utils';

export type RedisClientType = ReturnType<typeof createClient>;
export type RedisClientOptions = Parameters<typeof createClient>[0];

const redisClientFactory = (options: RedisClientOptions): RedisClientType => {
  return createClient(options);
};

export const initRedis = async () => {
  const redisClient = redisClientFactory({});
  redisClient.on("error", (err: unknown) => console.log("Redis Client Error", err))

  await redisClient.connect();

  while (!redisClient.isReady) {
    logger.info('Redis client not yet ready...');
    await sleep(200);
  }
  logger.info('Redis client ready!');

  return redisClient;
}
