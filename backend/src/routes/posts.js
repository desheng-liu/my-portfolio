const express = require('express');
const { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const dynamo = require('../dynamo');

const router = express.Router();
const TABLE = process.env.DYNAMO_POSTS_TABLE || 'portfolio-posts';

// GET /posts — list all published posts, sorted by date
router.get('/', async (req, res, next) => {
  try {
    const result = await dynamo.send(new ScanCommand({
      TableName: TABLE,
      FilterExpression: 'published = :p',
      ExpressionAttributeValues: { ':p': true },
    }));
    const posts = (result.Items || [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(({ content: _, ...meta }) => meta); // strip content from list view
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// GET /posts/:slug — single post
router.get('/:slug', async (req, res, next) => {
  try {
    const result = await dynamo.send(new ScanCommand({
      TableName: TABLE,
      FilterExpression: 'slug = :s AND published = :p',
      ExpressionAttributeValues: { ':s': req.params.slug, ':p': true },
    }));
    if (!result.Items || result.Items.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    res.json(result.Items[0]);
  } catch (err) {
    next(err);
  }
});

// POST /posts — create a post (admin only)
router.post('/', async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { title, content, excerpt, tags = [], published = false } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'title and content are required.' });

    const post = {
      id: uuidv4(),
      slug: slugify(title, { lower: true, strict: true }),
      title,
      content,
      excerpt: excerpt || content.slice(0, 160) + '…',
      tags,
      published,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamo.send(new PutCommand({ TableName: TABLE, Item: post }));
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

// PUT /posts/:id — update a post (admin only)
router.put('/:id', async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    const expressions = Object.keys(updates).map(k => `#${k} = :${k}`);
    const names = Object.fromEntries(Object.keys(updates).map(k => [`#${k}`, k]));
    const values = Object.fromEntries(Object.keys(updates).map(k => [`:${k}`, updates[k]]));

    await dynamo.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id: req.params.id },
      UpdateExpression: 'SET ' + expressions.join(', '),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    }));
    res.json({ message: 'Post updated.' });
  } catch (err) {
    next(err);
  }
});

// DELETE /posts/:id (admin only)
router.delete('/:id', async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await dynamo.send(new DeleteCommand({ TableName: TABLE, Key: { id: req.params.id } }));
    res.json({ message: 'Post deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
