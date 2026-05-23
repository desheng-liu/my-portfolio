const express = require('express');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const dynamo = require('../dynamo');

const router = express.Router();
const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });
const TABLE = process.env.DYNAMO_SUBSCRIBERS_TABLE || 'portfolio-subscribers';

// POST /newsletter/send — blast a newsletter to all subscribers (admin only)
router.post('/send', async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { subject, bodyHtml, bodyText } = req.body;
    if (!subject || !bodyHtml) {
      return res.status(400).json({ error: 'subject and bodyHtml are required.' });
    }

    // Fetch all active subscribers
    const result = await dynamo.send(new ScanCommand({
      TableName: TABLE,
      FilterExpression: 'active = :a',
      ExpressionAttributeValues: { ':a': true },
    }));
    const subscribers = result.Items || [];

    if (subscribers.length === 0) {
      return res.json({ message: 'No subscribers to send to.' });
    }

    // SES has a limit of 50 destinations per SendEmail call.
    // For large lists, use SendBulkTemplatedEmail or SES campaigns.
    const BATCH = 50;
    let sent = 0;
    for (let i = 0; i < subscribers.length; i += BATCH) {
      const batch = subscribers.slice(i, i + BATCH).map(s => s.email);
      await ses.send(new SendEmailCommand({
        Source: `${process.env.SES_FROM_NAME} <${process.env.SES_FROM_EMAIL}>`,
        Destination: { BccAddresses: batch },
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: {
            Html: { Data: bodyHtml, Charset: 'UTF-8' },
            Text: { Data: bodyText || subject, Charset: 'UTF-8' },
          },
        },
      }));
      sent += batch.length;
    }

    res.json({ message: `Newsletter sent to ${sent} subscriber(s).` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
