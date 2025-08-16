import 'dotenv/config';
import logger from '../../lib/logger';
import { initRedis } from '@/integrations/redis';
import { playRoundBasicRedisOps } from 'scripts/playground/redis/scratchpad';

const init = async () => {
  const redisClient = await initRedis();

  return {
    redisClient
  }
}

const main = async () => {
  try {
    const {
      redisClient
    } = await init();

    await playRoundBasicRedisOps(redisClient)

  } catch(err) {
    logger.error(err)
  }
}

main()
