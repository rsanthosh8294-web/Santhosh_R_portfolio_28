import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './src/db/index';
import { contactMessages, projectLikes, visitorAnalytics } from './src/db/schema';
import { eq, sql } from 'drizzle-orm';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'cloudsql_postgresql' });
  });

  // Contact form submission -> Cloud SQL DB
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
      console.error('Error saving contact message to Cloud SQL:', err);
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

  // --- Vercel Authentication & Integration API Routes ---

  // Get Vercel OAuth Authorization URL
  app.get('/api/vercel/auth/url', (req, res) => {
    const clientId = process.env.VERCEL_CLIENT_ID;
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${baseUrl.replace(/\/$/, '')}/api/vercel/auth/callback`;

    if (!clientId) {
      return res.json({
        configured: false,
        message: 'VERCEL_CLIENT_ID is not configured in environment. You can also connect directly using a Vercel Personal Access Token.',
        redirectUri,
      });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      state: 'vercel_portfolio_auth',
    });

    const authUrl = `https://vercel.com/oauth/authorize?${params.toString()}`;
    return res.json({ configured: true, url: authUrl, redirectUri });
  });

  // Vercel OAuth Callback
  const handleVercelCallback = async (req: express.Request, res: express.Response) => {
    const { code, error } = req.query;

    if (error) {
      return res.send(`
        <html>
          <body style="font-family: sans-serif; background: #0f172a; color: #f1f5f9; text-align: center; padding: 40px;">
            <h2 style="color: #ef4444;">Vercel Authentication Failed</h2>
            <p>${error}</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'VERCEL_AUTH_ERROR', error: '${error}' }, '*');
                setTimeout(() => window.close(), 2500);
              }
            </script>
          </body>
        </html>
      `);
    }

    if (!code) {
      return res.status(400).send('Missing authorization code');
    }

    try {
      const clientId = process.env.VERCEL_CLIENT_ID;
      const clientSecret = process.env.VERCEL_CLIENT_SECRET;
      const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const redirectUri = `${baseUrl.replace(/\/$/, '')}/api/vercel/auth/callback`;

      const tokenRes = await fetch('https://api.vercel.com/v2/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId || '',
          client_secret: clientSecret || '',
          code: code as string,
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange token');
      }

      const accessToken = tokenData.access_token;

      // Fetch user profile from Vercel
      const userRes = await fetch('https://api.vercel.com/v9/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userRes.json();

      res.send(`
        <html>
          <body style="font-family: system-ui, sans-serif; background: #090d16; color: #38bdf8; text-align: center; padding: 50px;">
            <div style="max-width: 400px; margin: 0 auto; background: #1e293b; padding: 30px; border-radius: 16px; border: 1px solid #38bdf840;">
              <h2 style="color: #38bdf8; margin-top: 0;">Connected to Vercel!</h2>
              <p style="color: #94a3b8;">Welcome, <strong>${userData.user?.username || userData.user?.name || 'Vercel User'}</strong></p>
              <p style="color: #64748b; font-size: 13px;">Closing authorization window...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'VERCEL_AUTH_SUCCESS',
                  token: '${accessToken}',
                  user: ${JSON.stringify(userData.user || {})}
                }, '*');
                setTimeout(() => window.close(), 1200);
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('Vercel OAuth exchange error:', err);
      res.send(`
        <html>
          <body style="font-family: sans-serif; background: #0f172a; color: #f1f5f9; text-align: center; padding: 40px;">
            <h2 style="color: #ef4444;">Vercel Token Exchange Error</h2>
            <p>${err.message}</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'VERCEL_AUTH_ERROR', error: '${err.message}' }, '*');
              }
            </script>
          </body>
        </html>
      `);
    }
  };

  app.get('/api/vercel/auth/callback', handleVercelCallback);
  app.get('/api/vercel/auth/callback/', handleVercelCallback);

  // Get Vercel User Profile
  app.post('/api/vercel/user', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = req.body?.token || (authHeader ? authHeader.replace('Bearer ', '') : process.env.VERCEL_AUTH_TOKEN);

      if (!token) {
        return res.status(401).json({
          authenticated: false,
          error: 'No Vercel token provided. Connect with OAuth or supply VERCEL_AUTH_TOKEN in environment variables.',
        });
      }

      const userRes = await fetch('https://api.vercel.com/v9/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await userRes.json();

      if (!userRes.ok) {
        return res.status(userRes.status).json({
          authenticated: false,
          error: data.error?.message || 'Invalid or expired Vercel Access Token.',
        });
      }

      return res.json({
        authenticated: true,
        user: data.user,
      });
    } catch (err: any) {
      console.error('Error fetching Vercel user:', err);
      return res.status(500).json({ error: 'Failed to authenticate with Vercel API.' });
    }
  });

  // Get Vercel Projects
  app.post('/api/vercel/projects', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = req.body?.token || (authHeader ? authHeader.replace('Bearer ', '') : process.env.VERCEL_AUTH_TOKEN);

      if (!token) {
        return res.status(401).json({ error: 'Vercel Authentication Token is required.' });
      }

      const projectsRes = await fetch('https://api.vercel.com/v9/projects?limit=20', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await projectsRes.json();

      if (!projectsRes.ok) {
        return res.status(projectsRes.status).json({ error: data.error?.message || 'Failed to fetch Vercel projects.' });
      }

      return res.json({ projects: data.projects || [] });
    } catch (err: any) {
      console.error('Error fetching Vercel projects:', err);
      return res.status(500).json({ error: 'Failed to fetch Vercel projects.' });
    }
  });

  // Get Vercel Deployments
  app.post('/api/vercel/deployments', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = req.body?.token || (authHeader ? authHeader.replace('Bearer ', '') : process.env.VERCEL_AUTH_TOKEN);

      if (!token) {
        return res.status(401).json({ error: 'Vercel Authentication Token is required.' });
      }

      const { projectId } = req.body;
      const query = projectId ? `?projectId=${projectId}&limit=10` : '?limit=10';

      const deployRes = await fetch(`https://api.vercel.com/v6/deployments${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await deployRes.json();

      if (!deployRes.ok) {
        return res.status(deployRes.status).json({ error: data.error?.message || 'Failed to fetch Vercel deployments.' });
      }

      return res.json({ deployments: data.deployments || [] });
    } catch (err: any) {
      console.error('Error fetching Vercel deployments:', err);
      return res.status(500).json({ error: 'Failed to fetch Vercel deployments.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fullstack server with Cloud SQL PostgreSQL running on http://localhost:${PORT}`);
  });
}

startServer();
