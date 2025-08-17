import { drizzle } from 'drizzle-orm/node-postgres';
import * as companySchema from './schema/company.schema';
import * as userSchema from './schema/user.schema';
import * as onboardingSchema from './schema/onboarding.schema'
import * as relations from './schema/relations.schema'
import { Logger as DrizzleLogger } from 'drizzle-orm';
import logger from '@/lib/logger';

class DbLogger implements DrizzleLogger {
  logQuery(query: string, params: unknown[]): void {
    logger.debug(`DB Query: ${query}, params: ${params}`);
  }
}

const db = drizzle({
  connection: process.env.DATABASE_URL!,
  logger: new DbLogger,
  schema: {
    ...companySchema,
    ...userSchema,
    ...onboardingSchema,
    ...relations
  },
});

export default db
