import { drizzle } from 'drizzle-orm/node-postgres';
import * as companySchema from './schema/company.schema';
import * as userSchema from './schema/user.schema';
import * as onboardingSchema from './schema/onboarding.schema'

const db = drizzle({
  connection: process.env.DATABASE_URL!,
  schema: {
    ...companySchema,
    ...userSchema,
    ...onboardingSchema,
  },
});

export default db
