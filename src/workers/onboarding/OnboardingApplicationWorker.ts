import { RedisQueueAdapter } from "@/infra/queue";
import { initRedis } from "@/integrations/redis";
import logger from "@/lib/logger";
import { OnboardingApplicationProcessor } from "@/services/onboarding/processors/OnboardingApplicationProcessor";

logger.info(`Running onboarding application worker`);
const main = async () => {
  try {
    const redisClient = await initRedis();
    const queue = new RedisQueueAdapter(redisClient);
    const processor = new OnboardingApplicationProcessor(queue)
    await processor.run()
  } catch (err) {
    logger.error(`Error running onboarding application worker: ${err}`)
  }
}

main()
