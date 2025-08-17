import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { companyTable } from "./company.schema";
import { usersTable } from "./user.schema";

export const onboardingApplicationTable = pgTable("onboarding_application", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  companyId: integer().references(() => companyTable.id).unique().notNull(),
  applicantId: integer().references(() => usersTable.id),
});
