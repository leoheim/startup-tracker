import { pgTable, uuid, varchar, text, integer, decimal, timestamp } from 'drizzle-orm/pg-core';
import { jsonb } from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const launches = pgTable('launches', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  platform: varchar('platform', { length: 20 }).notNull(), // 'twitter', 'linkedin'
  postUrl: varchar('post_url', { length: 500 }).notNull().unique(),
  postId: varchar('post_id', { length: 255 }),
  content: text('content'),
  videoUrl: varchar('video_url', { length: 500 }),
  authorHandle: varchar('author_handle', { length: 255 }),
  publishedAt: timestamp('published_at'),

  // Engagement metrics
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  sharesCount: integer('shares_count').default(0),
  viewsCount: integer('views_count').default(0),

  // Performance indicators
  engagementScore: decimal('engagement_score', { precision: 10, scale: 2 }),
  performanceTier: varchar('performance_tier', { length: 20 }), // 'low', 'medium', 'high'

  rawData: jsonb('raw_data'), // Complete API response
  lastScrapedAt: timestamp('last_scraped_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Launch = typeof launches.$inferSelect;
export type NewLaunch = typeof launches.$inferInsert;
