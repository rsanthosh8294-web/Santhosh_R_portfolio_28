import express from 'express';
import dotenv from 'dotenv';
import { db } from '../src/db/index';
import { contactMessages, projectLikes, visitorAnalytics } from '../src/db/schema';
import { eq, sql } from 'drizzle-orm';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'cloudsql_postgresql', platform: 'vercel' });
});

// Contact form submission -> Cloud SQL / PostgreSQL DB
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const inserted = await db.insert(contactMessages).values({
      name,
      email,
      subject: subject || 'Portfolio Contact',
      message,
    }).returning();

    return res.json({ success: true, message: inserted[0] });
  } catch (err: any) {
    console.error('Error saving contact message:', err);
    return res.status(500).json({ error: 'Failed to save message to database.' });
  }
});

// Get project likes
app.get('/api/likes/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await db.select().from(projectLikes).where(eq(projectLikes.projectId, projectId));
    const count = result.length > 0 ? result[0].likeCount : 0;
    return res.json({ projectId, count });
  } catch (err: any) {
    console.error('Error getting likes:', err);
    return res.json({ projectId: req.params.projectId, count: 0 });
  }
});

// Like a project
app.post('/api/likes/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await db.insert(projectLikes)
      .values({ projectId, likeCount: 1 })
      .onConflictDoUpdate({
        target: projectLikes.id,
        set: { likeCount: sql`${projectLikes.likeCount} + 1`, updatedAt: new Date() },
      })
      .returning();

    return res.json({ success: true, count: result[0]?.likeCount || 1 });
  } catch (err: any) {
    console.error('Error updating likes:', err);
    return res.status(500).json({ error: 'Failed to record like.' });
  }
});

// Record visitor analytics
app.post('/api/analytics/visit', async (req, res) => {
  try {
    const { page, referrer } = req.body;
    await db.insert(visitorAnalytics).values({
      page: page || '/',
      referrer: referrer || '',
      userAgent: req.headers['user-agent'] || '',
    });
    return res.json({ success: true });
  } catch (err: any) {
    console.error('Error logging visitor analytics:', err);
    return res.json({ success: false });
  }
});

export default app;
