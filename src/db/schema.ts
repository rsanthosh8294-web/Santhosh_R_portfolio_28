import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const visitorAnalytics = pgTable('visitor_analytics', {
  id: serial('id').primaryKey(),
  page: text('page').notNull(),
  referrer: text('referrer'),
  userAgent: text('user_agent'),
  visitedAt: timestamp('visited_at').defaultNow().notNull(),
});

export const projectLikes = pgTable('project_likes', {
  id: serial('id').primaryKey(),
  projectId: text('project_id').notNull(),
  likeCount: integer('like_count').default(1).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
