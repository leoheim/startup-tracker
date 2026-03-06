import { pgTable, uuid, varchar, date, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  website: varchar('website', { length: 500 }),
  industry: varchar('industry', { length: 100 }),
  foundedDate: date('founded_date'),
  employeeCount: integer('employee_count'),
  crunchbaseUrl: varchar('crunchbase_url', { length: 500 }),
  ycBatch: varchar('yc_batch', { length: 20 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
