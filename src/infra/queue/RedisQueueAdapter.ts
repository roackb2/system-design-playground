import { RedisClientType } from "@/integrations/redis";
import { QueueItem, QueuePort } from "./QueuePort";
import logger from "@/lib/logger";

export class RedisQueueAdapter implements QueuePort {
  private redisClient: RedisClientType;

  private QueueName = 'sdp:queue';

  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient;
  }

  private get name() {
    return RedisQueueAdapter.name;
  }


  private getQueueName(queueName: string): string {
    return `${this.QueueName}:${queueName}`
  }

  async enqueue<T extends Record<string, any>>(queueName: string, item: QueueItem<T>): Promise<boolean> {
    try {
      const key = this.getQueueName(queueName)
      logger.info(`${this.name} Enqueuing item into queue ${key}`)
      const res = await this.redisClient.lPush(key, JSON.stringify(item));
      logger.info(`${this.name} Enqueue item ${item.id} into queue, queue length: ${res}`)
      return true;
    } catch (err: unknown) {
      logger.error(`${this.name} Error enqueue item with id: ${item.id}, error: ${err}`);
      return false;
    }
  }

  async dequeue<T extends Record<string, any>>(queueName: string): Promise<QueueItem<T> | null> {
    try {
      const key = this.getQueueName(queueName)
      logger.info(`${this.name} Waiting for queue item in ${key}`)
      const item = await this.redisClient.brPop(key, 0);

      if (!item) {
        logger.warn(`${this.name}: Queue empty while dequeue`);
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
