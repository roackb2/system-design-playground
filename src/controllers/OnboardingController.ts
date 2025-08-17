import { QueuePort } from "@/infra/queue/QueuePort";
import logger from "@/lib/logger";
import { OnboardingApplicationSchema } from "@/services/onboarding/OnboardingApplication.types";
import { OnboardingService } from "@/services/onboarding/OnboardingService";
import { Request, Response } from "express";

export class OnboardingController {
  private onboardingService: OnboardingService;

  constructor(queue: QueuePort) {
    this.onboardingService = new OnboardingService(queue);
  }

  private get name() {
    return OnboardingController.name;
  }

  async handleApplicationSubmit(req: Request, res: Response) {
    logger.info(`${this.name}: Handle submit request: ${JSON.stringify(req.body)}`)

    if (!req.body) {
      res.status(400).json({
        error: 'Empty application',
        message: 'The request body has no value'
      })
      return;
    }

    const parseRes = OnboardingApplicationSchema.safeParse(req.body);

    if (!parseRes.success || !parseRes.data) {
      res.status(400).json({
        error: 'Invalid application',
        message: parseRes.error
      })
      return;
    }

    const result = this.onboardingService.handleApplicationSubmit(parseRes.data)

    res.json(result);
  }
}
