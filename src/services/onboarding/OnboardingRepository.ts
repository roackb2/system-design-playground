import db from "@/infra/db";
import { OnboardingApplicationType } from "./OnboardingApplication.types";
import { companyTable } from '@/infra/db/schema/company.schema';
import { eq } from "drizzle-orm";
import logger from "@/lib/logger";
import { onboardingApplicationTable } from "@/infra/db/schema/onboarding.schema";


export default class OnboardingRepository {
  static async saveOnboardingApplication(
    application: typeof onboardingApplicationTable.$inferInsert
  ): Promise<typeof onboardingApplicationTable.$inferSelect> {
    const [savedApplication] = await db
      .insert(onboardingApplicationTable)
      .values(application)
      .returning()

    return savedApplication
  }

  static async saveCompany(
    company: typeof companyTable.$inferInsert
  ): Promise<typeof companyTable.$inferSelect> {
    const existingCompany = await db.query.companyTable.findFirst({
      where: eq(companyTable.name, company.name)
    })

    if (existingCompany) {
      logger.warn(`${this.name} Company ${company.name} already exists. ID: ${existingCompany.id}`)
      return existingCompany;
    }

    const [savedCompany] = await db
      .insert(companyTable)
      .values(company)
      .returning();

    return savedCompany;
  }
}
