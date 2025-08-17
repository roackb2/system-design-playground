import 'dotenv/config';
import { getMainApp } from './app'
import { RedisQueueAdapter } from './infra/queue';
import { initRedis } from './integrations/redis';
import logger from './lib/logger';

const port = process.env.PORT || 3300

const runServer = async () => {
  try {
    const redisClient = await initRedis();
    const queue = new RedisQueueAdapter(redisClient);
    const mainApp = getMainApp({ queue })
    logger.info(`Server listening on ${port}`)
    mainApp.listen(port);
  } catch (err: unknown) {
    logger.error(`Error running server: ${err}`)
  }
}

runServer();

