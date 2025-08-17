import { OnboardingApplicationType, OnboardingCreditReportType, StoredOnboardingApplicationType } from "./OnboardingApplication.types";


export abstract class OnboardingPort {
  abstract saveApplication(application: OnboardingApplicationType):
    Promise<StoredOnboardingApplicationType>;

  abstract getApplicationById(id: number):
    Promise<StoredOnboardingApplicationType>;

  abstract updateApplicationWithCreditReport(args: {
    applicationId: number,
    creditReport: OnboardingCreditReportType
  }): Promise<void>
}
