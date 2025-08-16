import { RedisClientType } from "@/lib/redis";
import { QueueItem, QueuePort } from "./QueuePort";
import logger from "@/lib/logger";

export class RedisQueueAdapter implements QueuePort {
  private static QueueName = 'sdp:queue';

  private redisClient: RedisClientType;

  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient;
  }

  private get QueueName () {
    return RedisQueueAdapter.QueueName;
  }

  private get name() {
    return RedisQueueAdapter.name;
  }

  async enqueue (item: QueueItem): Promise<boolean> {
    try {
      const res = await this.redisClient.lPush(this.QueueName, JSON.stringify(item));
      logger.info(`${this.name}: enqueue item ${item.id} into queue, queue length: ${res}`)
      return true;
    } catch (err: unknown) {
      logger.error(`${this.name} Error enqueue item with id: ${item.id}, error: ${err}`);
      return false;
    }
  }

  async dequeue (): Promise<QueueItem | null> {
    try {
      const item = await this.redisClient.brPop(this.QueueName, Infinity);

      if (!item) {
        logger.info(`${this.name}: Queue empty while pop`);
        return null;
      }

      const parsed = JSON.parse(item.element);
      logger.info(`${this.name} Queue item popped, id: ${parsed.id}`);
      return parsed;
    } catch(err: unknown) {
      if (err instanceof SyntaxError) {
        logger.error(`${this.name}: Queue item is not valid JSON object. error: ${err}`)
      } else {
        logger.error(`${this.name}: Error getting queue item: ${err}`)
      }
      return null;
    }
  }
}
