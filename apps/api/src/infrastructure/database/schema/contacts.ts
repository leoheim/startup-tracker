import { pgTable, uuid, varchar, decimal, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { launches } from './launches';

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  launchId: uuid('launch_id').references(() => launches.id, { onDelete: 'set null' }),

  fullName: varchar('full_name', { length: 255 }),
  role: varchar('role', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  twitterHandle: varchar('twitter_handle', { length: 255 }),

  enrichmentSource: varchar('enrichment_source', { length: 100 }), // 'apollo', 'hunter', etc.
  enrichmentConfidence: decimal('enrichment_confidence', { precision: 3, scale: 2 }), // 0.0 to 1.0
  enrichedAt: timestamp('enriched_at'),

  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
