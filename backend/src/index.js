require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const subscriberRoutes = require('./routes/subscribers');
const postRoutes = require('./routes/posts');
const newsletterRoutes = require('./routes/newsletter');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '1mb' }));

// Global rate limiter
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Strict limiter for subscribe endpoint
const subscribeLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });

// ── Routes ───────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.use('/subscribe', subscribeLimiter, subscriberRoutes);
app.use('/posts', postRoutes);
app.use('/newsletter', newsletterRoutes);

// ── Error handler ────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio API running on port ${PORT}`);
});
