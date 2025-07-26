import { RedisClientType } from "@/lib/redis";
import logger from "@/lib/logger";

export const playRoundBasicRedisOps = async (redisClient: RedisClientType) => {
  const peopleKey = 'sdp:people:1'
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
