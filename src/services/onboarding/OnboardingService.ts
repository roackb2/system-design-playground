import logger from "@/lib/logger";
import { OnboardingApplicationProcessResultType, OnboardingApplicationType } from "./OnboardingApplication.types";


export class OnboardingService {
  static handleApplicationSubmit(
    application: OnboardingApplicationType
  ): OnboardingApplicationProcessResultType {
    logger.info(`${this.name}: Handling onboarding application: ${JSON.stringify(application)}`);
    return {
      success: true
    }
  }
}
