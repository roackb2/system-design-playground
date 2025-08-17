import { relations } from "drizzle-orm";
import { usersTable } from "./user.schema";
import { companyTable } from "./company.schema";
import { onboardingApplicationTable } from "./onboarding.schema";

export const usersRelations = relations(usersTable, ({ one }) => ({
	company: one(companyTable, {
		fields: [usersTable.companyId],
		references: [companyTable.id],
	}),
}));

export const onboardingRelations = relations(onboardingApplicationTable, ({ one }) => ({
  company: one(companyTable, {
		fields: [onboardingApplicationTable.companyId],
		references: [companyTable.id],
	}),
  applicant: one(usersTable, {
		fields: [onboardingApplicationTable.applicantId],
		references: [usersTable.id],
	}),
}))
