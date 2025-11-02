// Vercel Serverless Function (Node 18+)
// Deploy this file under /api/create-order in a Vercel project.
// It reads VTEX_APP_KEY and VTEX_APP_TOKEN from environment variables.

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const VTEX_APP_KEY = process.env.VTEX_APP_KEY;
    const VTEX_APP_TOKEN = process.env.VTEX_APP_TOKEN;
    const ACCOUNT = process.env.VTEX_ACCOUNT || 'aguasprata';

    if (!VTEX_APP_KEY || !VTEX_APP_TOKEN) {
      return res.status(500).json({ message: 'VTEX credentials not configured' });
    }

    const vtexUrl = `https://${ACCOUNT}.vtexcommercestable.com.br/api/checkout/pub/orders`;

    const resp = await fetch(vtexUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VTEX-API-AppKey': VTEX_APP_KEY,
        'X-VTEX-API-AppToken': VTEX_APP_TOKEN
      },
      body: JSON.stringify(req.body)
    });

    const data = await resp.json();
    const status = resp.status;

    return res.status(status).json(data);
  } catch (err) {
    console.error('create-order error', err);
    return res.status(500).json({ message: 'Internal server error', error: String(err) });
  }
};