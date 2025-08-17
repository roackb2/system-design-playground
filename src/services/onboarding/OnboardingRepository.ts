import db from "@/infra/db";
import { OnboardingApplicationType, OnboardingCreditReportType, StoredOnboardingApplicationType } from "./OnboardingApplication.types";
import { companyTable } from '@/infra/db/schema/company.schema';
import { eq, or } from "drizzle-orm";
import logger from "@/lib/logger";
import { OnboardingApplicationContentType, onboardingApplicationTable } from "@/infra/db/schema/onboarding.schema";
import { OnboardingPort } from "./OnboardingPort";
import merge from 'lodash/merge'

export default class OnboardingRepository implements OnboardingPort {
  private get name() {
    return OnboardingRepository.name;
  }

  async saveApplication(
    application: OnboardingApplicationType
  ): Promise<StoredOnboardingApplicationType> {
    const {
      companyName,
      taxId,
      purpose,
      industry,
    } = application
    logger.info(`${this.name}: Saving application for company ${companyName}, taxId: ${taxId}`)
    const companyPayload: typeof companyTable.$inferInsert = {
      name: companyName,
      taxId
    }

    const savedCompany = await this.saveCompany(companyPayload)

    const applicationPayload: typeof onboardingApplicationTable.$inferInsert = {
      companyId: savedCompany.id,
      content: {
        purpose,
        industry
      }
    }

    const [savedApplication] = await db
      .insert(onboardingApplicationTable)
      .values(applicationPayload)
      .onConflictDoUpdate({
        target: onboardingApplicationTable.companyId,
        set: applicationPayload
      })
      .returning()

    const storedApplication: StoredOnboardingApplicationType = {
      id: savedApplication.id,
      companyId: savedCompany.id,
      companyName: savedCompany.name,
      taxId: savedCompany.taxId,
      ...savedApplication.content,
    }

    logger.info(`${this.name} Application saved: ${storedApplication.id}`)

    return storedApplication
  }

  async getApplicationById(id: number): Promise<StoredOnboardingApplicationType> {
    const application = await db.query.onboardingApplicationTable.findFirst({
      where: eq(onboardingApplicationTable.id, id),
      with: {
        company: true
      }
    })

    if (!application) {
      throw new Error(`${this.name}: Application not found with id: ${id}`)
    }

    return {
      id: application.id,
      companyId: application.company.id,
      ...application.content,
      taxId: application?.company.taxId,
      companyName: application.company.name
    };
  }

  async updateApplicationWithCreditReport({
    applicationId,
    creditReport
  }: {
    applicationId: number;
    creditReport: OnboardingCreditReportType;
  }): Promise<void> {
    logger.info(`${this.name} Updating credit report for application: ${applicationId}`)
    const existingApplication = await db.query.onboardingApplicationTable.findFirst({
      where: eq(onboardingApplicationTable.id, applicationId)
    });

    if (!existingApplication) {
      throw new Error(`${this.name}: Application not found with ID: ${applicationId}`);
    }

    const mergedContent: OnboardingApplicationContentType = merge(existingApplication.content ?? {}, {
      creditReport
    })

    const payload: Partial<typeof onboardingApplicationTable.$inferInsert> = {
      content: mergedContent
    }

    await db.update(onboardingApplicationTable).set(payload)
    logger.info(`${this.name} Updated credit report for application: ${applicationId}`)
  }

  private async saveCompany(
    company: typeof companyTable.$inferInsert
  ): Promise<typeof companyTable.$inferSelect> {
    logger.info(`${this.name}: Saving company for ${company.name}`)
    const existingCompany = await db.query.companyTable.findFirst({
      where: or(
        eq(companyTable.name, company.name),
        eq(companyTable.taxId, company.taxId)
      )
    })

    if (existingCompany) {
      logger.warn(`${this.name} Company ${company.name} already exists. ID: ${existingCompany.id}`)
      return existingCompany;
    }

    const [savedCompany] = await db
      .insert(companyTable)
      .values(company)
      .returning();
    logger.info(`${this.name}: Company saved for ${company.name}`)

    return savedCompany;
  }
}
