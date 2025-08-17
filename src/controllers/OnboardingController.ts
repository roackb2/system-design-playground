import { QueuePort } from "@/infra/queue/QueuePort";
import logger from "@/lib/logger";
import { OnboardingApplicationFormSchema } from "@/services/onboarding/OnboardingApplication.types";
import OnboardingRepository from "@/services/onboarding/OnboardingRepository";
import { OnboardingService } from "@/services/onboarding/OnboardingService";
import { Request, Response } from "express";

export class OnboardingController {
  private onboardingService: OnboardingService;

  constructor({
    queue,
    repository
  }: {
    queue: QueuePort,
    repository: OnboardingRepository,
  }) {
    this.onboardingService = new OnboardingService({
      queue,
      repository
    });
  }

  private get name() {
    return OnboardingController.name;
  }

  async handleApplicationSubmit(req: Request, res: Response) {
    logger.info(`${this.name}: Handle submit request: ${JSON.stringify(req.body)}`)

    if (!req.body) {
      logger.error(`${this.name}: Empty application`)
      res.status(400).json({
        error: 'Empty application',
        message: 'The request body has no value'
      })
      return;
    }

    const parseRes = OnboardingApplicationFormSchema.safeParse(req.body);

    if (!parseRes.success || !parseRes.data) {
      logger.error(`${this.name}: Invalid application: ${parseRes.error}`)
      res.status(400).json({
        error: 'Invalid application',
        message: parseRes.error
      })
      return;
    }

    const result = await this.onboardingService.handleApplicationSubmit(parseRes.data)

    res.json(result);
  }
}
