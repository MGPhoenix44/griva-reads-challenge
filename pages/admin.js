import { useState } from 'react';
import Head from 'next/head';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setAuthenticated(true);
        setSubmissions(data.submissions);
      } else {
        setError(data.error || 'Invalid password.');
      }
    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) setSubmissions(data.submissions);
    } catch (err) {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Griva_Reads_Unchosen_Path_Submissions.docx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (err) {
      alert('Failed to download. Please try again.');
    }
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <>
      <Head>
        <title>Admin — Unchosen Path Submissions</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="admin-wrapper">
        <div className="admin-header">
          <h1>Unchosen Path — Admin</h1>
          <p>View and download student submissions</p>
        </div>

        {!authenticated ? (
          <>
            <div className="admin-password-form" style={{ flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                style={{ textAlign: 'center', maxWidth: '300px' }}
              />
              <button onClick={handleLogin} disabled={loading} style={{ minWidth: '200px' }}>
                {loading ? 'Checking…' : 'Enter'}
              </button>
            </div>
            {error && (
              <div className="status-message error" style={{ maxWidth: '400px', margin: '0 auto' }}>
                {error}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-number">{submissions.length}</div>
                <div className="stat-label">Total Submissions</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {[...new Set(submissions.map(s => s.formClass.toUpperCase()))].length}
                </div>
                <div className="stat-label">Form Classes</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
              <button className="download-btn" onClick={handleDownload} style={{ flex: 1 }}>
                📄 Download Word Document
              </button>
              <button
                className="download-btn"
                onClick={handleRefresh}
                disabled={loading}
                style={{
                  flex: '0 0 auto',
                  background: 'linear-gradient(135deg, #2a2a3a, #3a3a5a, #2a2a3a)',
                  borderColor: 'rgba(100, 100, 200, 0.35)',
                  color: '#8888cc',
                }}
              >
                {loading ? '⏳' : '🔄'} Refresh
              </button>
            </div>

            {submissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#6a5040', fontStyle: 'italic', fontSize: '18px' }}>
                No submissions yet. They&apos;ll appear here as students submit their stories.
              </div>
            ) : (
              <ul className="submission-list">
                {submissions.map((sub, i) => (
                  <li key={sub.id || i} className="submission-item">
                    <div className="submission-meta">
                      <div>
                        <div className="submission-name">{sub.fullName}</div>
                        <div className="submission-form-class">{sub.formClass}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="submission-date">{formatDate(sub.submittedAt)}</div>
                        <div style={{ fontSize: '12px', color: '#8a6a4a' }}>{sub.wordCount} words</div>
                      </div>
                    </div>
                    <div className="submission-story">{sub.story}</div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
