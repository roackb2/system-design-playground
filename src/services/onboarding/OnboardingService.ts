import logger from "@/lib/logger";
import { OnboardingApplicationProcessResultType, OnboardingApplicationQueueName, OnboardingApplicationQueuePayloadType, OnboardingApplicationType } from "./OnboardingApplication.types";
import { QueueItem, QueuePort } from "@/infra/queue/QueuePort";
import OnboardingRepository from "./OnboardingRepository";

export class OnboardingService {
  private queue: QueuePort;
  private repository: OnboardingRepository;

  constructor({
    queue,
    repository
  }: {
    queue: QueuePort
    repository: OnboardingRepository
  }) {
    this.queue = queue;
    this.repository = repository;
  }

  private get name() {
    return OnboardingService.name;
  }

  public async handleApplicationSubmit(
    application: OnboardingApplicationType
  ): Promise<OnboardingApplicationProcessResultType> {
    try {
      logger.info(`${this.name}: Handling onboarding application: ${JSON.stringify(application)}`);

      const storedApplication = await this.repository.saveApplication(application);

      const queueItem: QueueItem<OnboardingApplicationQueuePayloadType> = {
        id: crypto.randomUUID(),
        payload: {
          applicationId: storedApplication.id
        }
      }
      await this.queue.enqueue(OnboardingApplicationQueueName, queueItem);

      return { success: true };
    } catch (err: unknown) {
      logger.error(`${this.name} Error handling application submit: ${err}`);
      return { success: false, error: (err instanceof Error) ? err.message : String(err) };
    }
  }
}
