import { z } from 'zod';

export const OnboardingApplicationQueueName = 'onboarding:application';

export const OnboardingApplicationSchema = z.object({
  companyName: z.string().min(1).max(20).describe('The legal company name')
})

export type OnboardingApplicationType = z.infer<typeof OnboardingApplicationSchema>

export interface OnboardingApplicationProcessResultType {
  success: boolean
}
