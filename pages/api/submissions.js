import { getSubmissions } from '../../lib/storage';

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
    const submissions = await getSubmissions();
    return res.status(200).json({ submissions });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Server error.' });
  }
}
