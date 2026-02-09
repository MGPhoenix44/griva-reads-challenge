import { getSubmissions, saveSubmissions } from '../../lib/storage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, formClass, story, wordCount } = req.body;

    if (!fullName || !formClass || !story) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (wordCount > 250) {
      return res.status(400).json({ error: 'Story exceeds the 250 word limit.' });
    }

    const submission = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      fullName,
      formClass,
      story,
      wordCount,
      submittedAt: new Date().toISOString(),
    };

    const submissions = await getSubmissions();
    submissions.push(submission);
    await saveSubmissions(submissions);

    return res.status(200).json({ success: true, message: 'Submission received!' });
  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
}
