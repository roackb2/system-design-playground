import { OnboardingCreditReportType } from './../../../services/onboarding/OnboardingApplication.types';
import { integer, jsonb, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { companyTable } from "./company.schema";
import { usersTable } from "./user.schema";
import { baseTimestampFields } from "./baseFields";
import { Industry } from "@/services/onboarding/OnboardingApplication.types";

export interface OnboardingApplicationContentType {
  purpose: string;
  industry: Industry
  creditReport?: OnboardingCreditReportType
}

export const onboardingApplicationTable = pgTable("onboarding_application", {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  companyId: integer('company_id').references(() => companyTable.id).unique().notNull(),
  applicantId: integer('applicant_id').references(() => usersTable.id), // optional for now
  content: jsonb('content').notNull().$type<OnboardingApplicationContentType>(),
  ...baseTimestampFields,
});
