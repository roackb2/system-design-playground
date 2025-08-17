import 'dotenv/config';
import { RedisQueueAdapter } from "@/infra/queue";
import { initRedis } from "@/integrations/redis";
import logger from "@/lib/logger";
import { OnboardingApplicationProcessor } from "@/services/onboarding/processors/OnboardingApplicationProcessor";
import OnboardingRepository from '@/services/onboarding/OnboardingRepository';

logger.info(`Running onboarding application worker`);

const main = async () => {
  try {
    const redisClient = await initRedis();
    const queue = new RedisQueueAdapter(redisClient);
    const onboardingRepository = new OnboardingRepository();
    const processor = new OnboardingApplicationProcessor({
      queue,
      repository: onboardingRepository
    })
    await processor.run()
  } catch (err) {
    logger.error(`Error running onboarding application worker: ${err}`)
  }
}

main()
