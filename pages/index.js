import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [fullName, setFullName] = useState('');
  const [formClass, setFormClass] = useState('');
  const [story, setStory] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message: '' }
  const [submitting, setSubmitting] = useState(false);

  const wordCount = story.trim() === '' ? 0 : story.trim().split(/\s+/).length;
  const isOverLimit = wordCount > 250;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !formClass.trim() || !story.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all fields before submitting.' });
      return;
    }
    if (isOverLimit) {
      setStatus({ type: 'error', message: 'Your story exceeds the 250 word limit. Please shorten it.' });
      return;
    }
    if (wordCount < 10) {
      setStatus({ type: 'error', message: 'Your story is a bit short — write at least a few sentences!' });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          formClass: formClass.trim(),
          story: story.trim(),
          wordCount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: '🔥 Your alternative ending has been submitted! Good luck — may the best story rise from the ashes.' });
        setFullName('');
        setFormClass('');
        setStory('');
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Could not connect. Please check your internet and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Griva Reads — The Unchosen Path Challenge</title>
        <meta name="description" content="Write an alternative ending to our Gothic story. The Unchosen Path Challenge by Griva Reads." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* =================== POSTER =================== */}
      <div className="poster-wrapper">
        <div className="poster">
          <div className="embers">
            {[...Array(10)].map((_, i) => <div key={i} className="ember" />)}
          </div>
          <div className="fire-glow" />
          <div className="vignette" />

          <div className="content">
            <div className="series-banner">— Griva Reads Presents —</div>
            <div className="main-title">The Unchosen<br />Path</div>
            <div className="subtitle">Challenge</div>

            <div className="divider">
              <div className="divider-line" />
              <div className="divider-diamond" />
              <div className="divider-line" />
            </div>

            {/* Scene SVG */}
            <div className="scene">
              <svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="fireGlow" cx="50%" cy="90%" r="60%">
                    <stop offset="0%" stopColor="#ff4500" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                  <linearGradient id="houseBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a1210" />
                    <stop offset="100%" stopColor="#0f0a08" />
                  </linearGradient>
                  <linearGradient id="phoenixBody" x1="0" y1="0" x2="0.3" y2="1">
                    <stop offset="0%" stopColor="#ffd700" />
                    <stop offset="30%" stopColor="#ff8c00" />
                    <stop offset="70%" stopColor="#ff4500" />
                    <stop offset="100%" stopColor="#cc2200" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="softGlow">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>

                <rect x="0" y="0" width="520" height="260" fill="url(#fireGlow)" />
                <rect x="0" y="230" width="520" height="30" fill="#0a0705" opacity="0.8" />

                {/* House */}
                <g transform="translate(260, 120)">
                  <rect x="-70" y="10" width="140" height="110" fill="url(#houseBody)" stroke="#2a1a10" strokeWidth="1" />
                  <polygon points="-80,12 0,-45 80,12" fill="#120d0a" stroke="#2a1a10" strokeWidth="1" />
                  <rect x="30" y="-35" width="18" height="40" fill="#15100c" stroke="#2a1a10" strokeWidth="1" />
                  <rect x="-15" y="65" width="30" height="55" fill="#0a0605" stroke="#3a2010" strokeWidth="1" rx="15" />
                  <rect x="-55" y="30" width="28" height="32" fill="#0a0605" stroke="#3a2010" strokeWidth="1" />
                  <rect x="27" y="30" width="28" height="32" fill="#0a0605" stroke="#3a2010" strokeWidth="1" />
                  <rect className="fire-flicker" x="-53" y="32" width="24" height="28" fill="#ff4500" opacity="0.35" rx="2" />
                  <rect className="fire-flicker" x="29" y="32" width="24" height="28" fill="#ff6b00" opacity="0.3" rx="2" style={{ animationDelay: '0.15s' }} />
                  <circle cx="0" cy="-15" r="12" fill="#0a0605" stroke="#3a2010" strokeWidth="1" />
                  <circle className="fire-flicker" cx="0" cy="-15" r="10" fill="#ff3500" opacity="0.3" style={{ animationDelay: '0.25s' }} />

                  <g className="fire-flicker" filter="url(#glow)" opacity="0.8">
                    <ellipse cx="-30" cy="-20" rx="12" ry="30" fill="#ff4500" opacity="0.6" transform="rotate(-5, -30, -20)" />
                    <ellipse cx="0" cy="-30" rx="10" ry="35" fill="#ff6b00" opacity="0.5" />
                    <ellipse cx="25" cy="-18" rx="11" ry="28" fill="#ff4500" opacity="0.55" transform="rotate(8, 25, -18)" />
                    <ellipse cx="-15" cy="-25" rx="8" ry="25" fill="#ffa500" opacity="0.4" transform="rotate(-3, -15, -25)" />
                    <ellipse cx="12" cy="-28" rx="7" ry="22" fill="#ff8c00" opacity="0.45" />
                    <ellipse cx="-5" cy="-20" rx="5" ry="18" fill="#ffd700" opacity="0.3" />
                    <ellipse cx="10" cy="-15" rx="4" ry="15" fill="#ffcc00" opacity="0.25" />
                  </g>

                  <g opacity="0.15">
                    <ellipse cx="40" cy="-60" rx="20" ry="8" fill="#888" transform="rotate(-10)">
                      <animate attributeName="cy" values="-60;-80;-60" dur="6s" repeatCount="indefinite" />
                    </ellipse>
                    <ellipse cx="-10" cy="-75" rx="25" ry="6" fill="#777">
                      <animate attributeName="cy" values="-75;-95;-75" dur="8s" repeatCount="indefinite" />
                    </ellipse>
                  </g>
                </g>

                {/* Phoenix */}
                <g className="phoenix-glow" transform="translate(415, 80)" filter="url(#glow)">
                  <ellipse cx="0" cy="20" rx="55" ry="65" fill="#ff6b00" opacity="0.08" filter="url(#softGlow)" />
                  <ellipse cx="0" cy="40" rx="14" ry="22" fill="url(#phoenixBody)" opacity="0.9" />
                  <path d="M-3,20 Q-5,5 2,-10" stroke="#ffa500" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <circle cx="3" cy="-14" r="6" fill="#ffd700" />
                  <circle cx="5" cy="-15" r="1.5" fill="#fff" />
                  <polygon points="9,-14 15,-16 9,-12" fill="#ff4500" />
                  <line x1="1" y1="-20" x2="-3" y2="-32" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="3" y1="-20" x2="3" y2="-34" stroke="#ffa500" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="5" y1="-19" x2="9" y2="-30" stroke="#ff8c00" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="-3" cy="-33" r="2" fill="#ffd700" opacity="0.8" />
                  <circle cx="3" cy="-35" r="2" fill="#ffa500" opacity="0.8" />
                  <circle cx="9" cy="-31" r="2" fill="#ff8c00" opacity="0.8" />
                  <path d="M-10,30 Q-50,10 -60,-20 Q-45,0 -30,5 Q-40,-15 -50,-35 Q-35,-10 -20,-5 Q-30,-25 -35,-45 Q-20,-15 -12,10 Z" fill="url(#phoenixBody)" opacity="0.85" />
                  <path d="M10,30 Q50,10 55,-25 Q42,-2 28,3 Q38,-18 45,-40 Q32,-12 20,-5 Q28,-28 32,-48 Q18,-18 12,10 Z" fill="url(#phoenixBody)" opacity="0.85" />
                  <path d="M-5,58 Q-20,90 -30,130 Q-10,100 -2,75" stroke="#ff4500" strokeWidth="2.5" fill="#cc2200" opacity="0.6" />
                  <path d="M0,60 Q0,95 -5,135 Q5,100 3,75" stroke="#ff6b00" strokeWidth="2.5" fill="#ff4500" opacity="0.5" />
                  <path d="M5,58 Q20,88 25,125 Q12,95 6,72" stroke="#ffa500" strokeWidth="2.5" fill="#ff6b00" opacity="0.5" />
                  <circle cx="-30" cy="130" r="3" fill="#ffd700" opacity="0.4" />
                  <circle cx="-5" cy="135" r="3" fill="#ff8c00" opacity="0.35" />
                  <circle cx="25" cy="125" r="3" fill="#ffa500" opacity="0.3" />
                </g>

                <g className="fire-flicker" opacity="0.5" style={{ animationDelay: '0.1s' }}>
                  <ellipse cx="210" cy="225" rx="6" ry="15" fill="#ff4500" />
                  <ellipse cx="300" cy="225" rx="5" ry="12" fill="#ff6b00" />
                  <ellipse cx="250" cy="228" rx="4" ry="10" fill="#ff8c00" />
                </g>
              </svg>
            </div>

            <div className="challenge-text">
              Our Gothic story took one path — but <em>what if it hadn&apos;t?</em><br />
              Write an <strong>alternative ending</strong>. Choose a path we never took.<br />
              Make it dark. Make it thrilling. Make it <em>unforgettable.</em>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <div className="info-label">Word Limit</div>
                <div className="info-value">Up to 250<br /><small>words</small></div>
              </div>
              <div className="info-card">
                <div className="info-label">Deadline</div>
                <div className="info-value date">Friday 27th<br />February</div>
              </div>
              <div className="info-card full-width">
                <div className="info-label">Featured On Griva Reads</div>
                <div className="info-value date">Monday 2nd March 🔥</div>
              </div>
            </div>

            <div className="wow-badge">
              <div className="wow-text">
                Use at least <strong>4 Words of the Week</strong><br />
                gathered since September for <strong>special points!</strong>
              </div>
            </div>

            <div className="prize-box">
              <div className="prize-label">The Winner</div>
              <div className="prize-text">Your story featured on Griva Reads</div>
            </div>

            <div className="divider" style={{ width: '60%', marginBottom: '8px' }}>
              <div className="divider-line" />
              <div className="divider-diamond" />
              <div className="divider-line" />
            </div>

            <div className="thanks">
              <div className="thanks-text">
                Special thanks to <strong>Miss Threlfall&apos;s 8C</strong><br />
                for the inspiration — two weeks of voting to<br />
                <em>&quot;burn the house down&quot;</em> sparked this challenge 🔥
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================== FORM =================== */}
      <div className="form-section">
        <div className="form-container">
          <h2 className="form-title">Submit Your Ending</h2>
          <p className="form-subtitle">The ashes await your story…</p>

          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              className="form-input"
              type="text"
              placeholder="e.g. Jamie Rodriguez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="formClass">Form Class</label>
            <input
              id="formClass"
              className="form-input"
              type="text"
              placeholder="e.g. 8C"
              value={formClass}
              onChange={(e) => setFormClass(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="story">Your Alternative Ending</label>
            <textarea
              id="story"
              className="form-textarea"
              placeholder="The flames licked the walls of the old house, and as the last beam collapsed, something stirred in the ashes…"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              spellCheck={true}
              lang="en"
            />
            <div className="word-counter">
              <span
                className={`count ${isOverLimit ? 'over' : wordCount > 220 ? 'warn' : 'ok'}`}
              >
                {wordCount} / 250 words
              </span>
            </div>
          </div>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={submitting || isOverLimit}
          >
            {submitting ? 'Submitting…' : '🔥 Submit Your Story'}
          </button>

          {status && (
            <div className={`status-message ${status.type}`}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
