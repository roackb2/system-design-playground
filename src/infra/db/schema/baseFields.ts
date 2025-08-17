import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const baseTimestampFields = {
  createdAt: timestamp('created_at', { mode: 'string', withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true }).notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
}
