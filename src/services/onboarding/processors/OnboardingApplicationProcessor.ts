import { OnboardingApplicationQueuePayloadType, OnboardingApplicationWithRiskReportType, OnboardingCreditReportType, OnboardingRiskLevel } from './../OnboardingApplication.types';
import { QueuePort } from "@/infra/queue/QueuePort";
import { OnboardingApplicationQueueName, OnboardingApplicationFormSchema, OnboardingApplicationType } from "../OnboardingApplication.types";
import logger from "@/lib/logger";
import { OnboardingPort } from "../OnboardingPort";


export class OnboardingApplicationProcessor {
  private queue: QueuePort;

  private repository: OnboardingPort;

  constructor ({
    queue,
    repository
  }: {
    queue: QueuePort,
    repository: OnboardingPort
  }) {
    this.queue = queue;
    this.repository = repository;
  }

  private get name() {
    return OnboardingApplicationProcessor.name;
  }

  public async run () {
    while (true) {
      // Handle error while processing each item separately
      try {
        const item = await this.queue.dequeue<OnboardingApplicationQueuePayloadType>(OnboardingApplicationQueueName)

        if (!item) {
          logger.warn(`Queue item empty`);
          // Sleep for a while to prevent busy waiting
          await new Promise((resolve) => setTimeout(resolve, 1000))
          continue;
        }

        const { payload } = item

        await this.processApplication(payload.applicationId);
      } catch (err: unknown) {
        logger.error(`${this.name} Error processing application: ${err}`)
        // Don't throw, keep processing next item;
        // TODO: Put item to DLQ
      }
    }
  }

  private async processApplication (applicationId: number) {
    logger.info(`${this.name}: Processing application: ${applicationId}`)
    const application = await this.repository.getApplicationById(applicationId)
    const companyInfo = await this.getCompanyInfo(application.taxId);
    // TODO: update application with detail company info
    const report = await this.getCreditReport(application.companyId);
    await this.repository.updateApplicationWithCreditReport({
      applicationId: application.id,
      creditReport: report
    })
    logger.info(`${this.name} Done processing onboarding application: ${application.id} , report: ${JSON.stringify(report)}`);
  }

  private async getCompanyInfo(taxId: string) {
    // TODO: Get company information from external source.
    logger.info(`${this.name} Getting company info for company with Tax ID: ${taxId}`)
    await new Promise((resolve) => setTimeout(resolve, 200))
    const info = {
      websiteUrl: 'https://bood_biz.com'
    }
    return info
  }

  private async getCreditReport(companyId: number): Promise<OnboardingCreditReportType> {
    // TODO: Get company credit report from auditing services.
    logger.info(`${this.name} Getting credit report for ${companyId}`)
    // simulate getting report from external service
    await new Promise((resolve) => setTimeout(resolve, 200))
    return {
      score: 4.5,
      riskLevel: OnboardingRiskLevel.Low,
    }
  }
}
