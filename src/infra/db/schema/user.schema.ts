import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { companyTable } from "./company.schema";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  companyId: integer().references(() => companyTable.id)
});
