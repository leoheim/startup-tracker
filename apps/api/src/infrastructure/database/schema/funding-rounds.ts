import { pgTable, uuid, varchar, decimal, date, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const fundingRounds = pgTable('funding_rounds', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  roundType: varchar('round_type', { length: 50 }), // Seed, Series A, B, C, etc.
  amountRaised: decimal('amount_raised', { precision: 15, scale: 2 }),
  currency: varchar('currency', { length: 10 }).default('USD'),
  announcedDate: date('announced_date'),
  investors: jsonb('investors'), // Array of investor objects
  source: varchar('source', { length: 100 }), // Crunchbase, YC, etc.
  sourceUrl: varchar('source_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type FundingRound = typeof fundingRounds.$inferSelect;
export type NewFundingRound = typeof fundingRounds.$inferInsert;
