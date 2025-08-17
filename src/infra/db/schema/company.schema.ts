import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { baseTimestampFields } from "./baseFields";

export const companyTable = pgTable("company", {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  taxId: varchar('tax_id', { length: 255 }).notNull().unique(),
  domain: varchar('domain', { length: 255 }),
  ...baseTimestampFields,
});
