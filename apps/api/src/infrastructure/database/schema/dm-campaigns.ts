import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { launches } from './launches';
import { contacts } from './contacts';

export const dmCampaigns = pgTable('dm_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  launchId: uuid('launch_id')
    .notNull()
    .references(() => launches.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id')
    .notNull()
    .references(() => contacts.id, { onDelete: 'cascade' }),

  platform: varchar('platform', { length: 20 }), // 'twitter', 'linkedin'
  messageTemplate: text('message_template'),
  generatedMessage: text('generated_message'),

  status: varchar('status', { length: 50 }).default('draft'), // draft, sent, failed
  sentAt: timestamp('sent_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type DmCampaign = typeof dmCampaigns.$inferSelect;
export type NewDmCampaign = typeof dmCampaigns.$inferInsert;
