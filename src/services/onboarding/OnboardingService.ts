import logger from "@/lib/logger";
import { OnboardingApplicationProcessResultType, OnboardingApplicationQueueName, OnboardingApplicationType } from "./OnboardingApplication.types";
import { QueueItem, QueuePort } from "@/infra/queue/QueuePort";

export class OnboardingService {
  private queue: QueuePort;

  constructor(queue: QueuePort) {
    this.queue = queue;
  }

  private get name() {
    return OnboardingService.name;
  }

  public async handleApplicationSubmit(
    application: OnboardingApplicationType
  ): Promise<OnboardingApplicationProcessResultType> {
    try {
      logger.info(`${this.name}: Handling onboarding application: ${JSON.stringify(application)}`);

      const queueItem: QueueItem = {
        id: crypto.randomUUID(),
        payload: application
      }

      await this.queue.enqueue(OnboardingApplicationQueueName, queueItem);

      return { success: true };
    } catch (err: unknown) {
      logger.error(`${this.name} Error handling application submit: ${err}`);
      return { success: false };
    }
  }
}
