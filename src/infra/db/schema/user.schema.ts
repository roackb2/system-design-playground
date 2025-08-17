import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { companyTable } from "./company.schema";
import { baseTimestampFields } from "./baseFields";

export const usersTable = pgTable("users", {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  companyId: integer('company_id').references(() => companyTable.id),
  ...baseTimestampFields
});
