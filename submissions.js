import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'grivareads2025';

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid password.' });
  }

  try {
    const raw = await kv.lrange('griva-submissions', 0, -1);
    const submissions = raw.map((item) =>
      typeof item === 'string' ? JSON.parse(item) : item
    );

    return res.status(200).json({ submissions });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
}
