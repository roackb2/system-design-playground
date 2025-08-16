import { QueuePort } from "@/infra/queue/QueuePort";
import { OnboardingApplicationSchema, OnboardingApplicationType } from "../OnboardingApplication.types";
import logger from "@/lib/logger";


export class OnboardingApplicationProcessor {
  private queue: QueuePort;

  constructor (queue: QueuePort) {
    this.queue = queue;
  }

  private get name() {
    return OnboardingApplicationProcessor.name;
  }

  public async run () {
    while (true) {
      // Handle error while processing each item separately
      try {
        const item = await this.queue.dequeue()

        if (!item) {
          logger.warn(`Queue item empty`);
          // Sleep for a while to prevent busy waiting
          await new Promise((resolve) => setTimeout(resolve, 1000))
          continue;
        }

        const { payload } = item

        const parsedItem = OnboardingApplicationSchema.safeParse(payload);
        if (!parsedItem.success || !parsedItem.data) {
          // TODO: Use domain specific error type
          throw new Error(`Invalid application format: ${parsedItem.error}`)
        }

        this.processApplication(parsedItem.data);
      } catch (err: unknown) {
        logger.error(`${this.name} Error processing application: ${err}`)
        // Don't throw, keep processing next item;
        // TODO: Put item to DLQ
      }
    }
  }

  private async processApplication (application: OnboardingApplicationType) {
    const { companyName } = application
    logger.info(`${this.name} Processing application: ${companyName}`)
    const companyInfo = await this.getCompanyInfo(companyName);
    const report = await this.getCreditReport(companyInfo.id);
    logger.info(`${this.name} Done processing onboarding application for company ${companyInfo.id}, report: ${JSON.stringify(report)}`);
  }

  private getCompanyInfo(companyName: string) {
    // TODO: Get company information from external source.
    logger.info(`${this.name} Getting company info for ${companyName}`)
    const info = {}
    return {
      ...info,
      companyName,
      id: 0,
    }
  }

  private getCreditReport(companyId: number) {
    // TODO: Get company credit report from auditing services.
    logger.info(`${this.name} Getting credit report for ${companyId}`)
    return {
      score: '4.5',
      riskLevel: 'low',
    }
  }

}
