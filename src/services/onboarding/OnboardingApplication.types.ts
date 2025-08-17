import { QueueItem } from '@/infra/queue/QueuePort';
import { z } from 'zod';

export const OnboardingApplicationQueueName = 'onboarding:application';

export enum Industry {
  Finance = 'finance',
  HealthCare = 'health care',
  Manufacturing = 'manufacturing',
  Retail = 'retail',
  Construction = 'construction',
  InformationTechnology = 'information technology',
  ProfessionalService = 'professional service',
}

export const OnboardingApplicationFormSchema = z.object({
  companyName: z.string().min(1).max(20).describe('The legal company name'),
  taxId: z.string().min(9).max(9).describe('The Tax ID of the registered company'),
  industry: z.enum(Industry).describe('The industry that the company belongs to'),
  purpose: z.string().min(10).max(1000).describe('The purpose for overall loan applications')
})
export type OnboardingApplicationType = z.infer<typeof OnboardingApplicationFormSchema>
export type StoredOnboardingApplicationType = OnboardingApplicationType & {
  id: number
  companyId: number
}

export interface OnboardingApplicationProcessResultType {
  success: boolean
  error?: string
}

export enum OnboardingRiskLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export const OnboardingCreditReportSchema = z.object({
  score: z.number().min(0).max(5).describe('The overall credit score for the company, ranging from 0 ~ 5'),
  riskLevel: z.enum(OnboardingRiskLevel).describe('The risk level assessment for the company'),
})
export type OnboardingCreditReportType = z.infer<typeof OnboardingCreditReportSchema>

export type OnboardingApplicationWithRiskReportType = StoredOnboardingApplicationType & {
  riskReport: OnboardingCreditReportType
}

export type OnboardingApplicationQueuePayloadType = {
  applicationId: number
}
