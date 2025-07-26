import { getKey, RedisClientType } from "@/lib/redis";
import logger from "@/lib/logger";

const playWithString = async (redisClient: RedisClientType) => {
  const lastPostKey = getKey('last_post:1');
  const content = 'I lost sleep last night so I started coding';
  await redisClient.set(lastPostKey, content);

  const res = await redisClient.get(lastPostKey);
  logger.info(`Redis value of last post: ${res}`);
}

const playWithHash = async (redisClient: RedisClientType) => {
  const peopleKey = getKey('people:1')
  const payload = {
    name: 'Fienna Liang',
    mail: 'roackb2@gmail.com'
  }
  await redisClient.hSet(peopleKey, payload);
  const name = await redisClient.hGet(peopleKey, 'name');
  logger.info(`Redis value for name after set: ${name}`);

  const obj = await redisClient.hGetAll(peopleKey);
  logger.info(`Entire object: ${JSON.stringify(obj, null, 2)}`)
}

const playWithDocumentStore = async  (redisClient: RedisClientType) => {
  // TODO: see https://redis.io/docs/latest/develop/get-started/document-database/
}

export const playRoundBasicRedisOps = async (redisClient: RedisClientType) => {
  await playWithString(redisClient);
  await playWithHash(redisClient);
}
