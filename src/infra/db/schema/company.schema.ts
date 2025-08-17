import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const companyTable = pgTable("company", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  domain: varchar({ length: 255 }),
});
