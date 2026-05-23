const express = require('express');
const { PutCommand, GetCommand, ScanCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const dynamo = require('../dynamo');

const router = express.Router();
const TABLE = process.env.DYNAMO_SUBSCRIBERS_TABLE || 'portfolio-subscribers';

// POST /subscribe — add a new subscriber
router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email required.' });
    }

    const normalised = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await dynamo.send(new GetCommand({
      TableName: TABLE,
      Key: { email: normalised },
    }));
    if (existing.Item) {
      return res.status(200).json({ message: 'You\'re already subscribed!' });
    }

    await dynamo.send(new PutCommand({
      TableName: TABLE,
      Item: {
        email: normalised,
        subscribedAt: new Date().toISOString(),
        active: true,
      },
    }));

    res.status(201).json({ message: 'Thanks for subscribing! 🎉' });
  } catch (err) {
    next(err);
  }
});

// DELETE /subscribe — unsubscribe
router.delete('/', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required.' });
    await dynamo.send(new DeleteCommand({
      TableName: TABLE,
      Key: { email: email.toLowerCase().trim() },
    }));
    res.json({ message: 'Unsubscribed successfully.' });
  } catch (err) {
    next(err);
  }
});

// GET /subscribe/list — list all subscribers (protect with API key in production)
router.get('/list', async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const result = await dynamo.send(new ScanCommand({ TableName: TABLE }));
    res.json({ count: result.Count, subscribers: result.Items });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
