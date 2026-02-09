import { put, head } from '@vercel/blob';

export async function getSubmissions() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const info = await head('submissions.json', { token });
    if (info && info.url) {
      const res = await fetch(info.url);
      if (res.ok) return await res.json();
    }
  } catch (e) {
    // File doesn't exist yet — that's fine
  }
  return [];
}

export async function saveSubmissions(submissions) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  await put('submissions.json', JSON.stringify(submissions), {
    access: 'public',
    addRandomSuffix: false,
    token,
  });
}
