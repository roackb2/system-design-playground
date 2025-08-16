import logger from "@/lib/logger";
import { OnboardingApplicationSchema } from "@/services/onboarding/OnboardingApplication.types";
import { OnboardingService } from "@/services/onboarding/OnboardingService";
import { Request, Response } from "express";

export class OnboardingController {
  static handleApplicationSubmit(req: Request, res: Response) {
    logger.info(`${this.name}: Handle submit request: ${JSON.stringify(req.body)}`)

    const parseRes = OnboardingApplicationSchema.safeParse(req.body);

    if (!parseRes.success || !parseRes.data) {
      res.json({
        error: 'Invalid application',
        message: parseRes.error
      })
      return;
    }

    const result = OnboardingService.handleApplicationSubmit(parseRes.data)

    res.json(result);
  }
}
