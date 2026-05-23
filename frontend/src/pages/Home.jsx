import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [msg, setMsg] = useState('');

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch(`${API}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMsg(data.message || 'You\'re subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMsg(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMsg('Could not connect to server. Try again later.');
    }
  }

  return (
    <div className="page">
      {/* Hero */}
      <section className="home-hero">
        <div className="container home-hero-inner">
          <p className="section-label fade-up">Software Engineer</p>
          <h1 className="fade-up fade-up-1 home-hero-title">
            Hi, I'm <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Desheng Liu</span>.<br/>
            Welcome to my personal website.
          </h1>
          <p className="fade-up fade-up-2 home-hero-subtitle">
            Software engineer out of Dallas, TX. I build things for fun and for work.
          </p>
          <div className="fade-up fade-up-3 home-cta">
            <Link to="/projects" className="btn btn-fill">View Projects</Link>
            <Link to="/resume" className="btn">See Resume</Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="home-about">
        <div className="container home-about-grid">
          <div>
            <p className="section-label">About</p>
            <h2 className="section-title" style={{ marginBottom: 20 }}>A little about me</h2>
            <div className="divider" />
            <p style={{ color: 'var(--ink-muted)', lineHeight: 1.8, marginBottom: 16 }}>
              I'm a software engineer with a passion for building scalable web applications
              and writing about what I learn along the way.
            </p>
            <p style={{ color: 'var(--ink-muted)', lineHeight: 1.8, marginBottom: 32 }}>
              When I'm not coding, I'm playing basketball, soccer, or video games. One of the three!
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['React', 'Node.js', 'AWS', 'TypeScript', 'PostgreSQL'].map(skill => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>
          <div className="home-quote-card">
            <div className="home-quote-mark">"</div>
            <p className="home-quote-text">
              There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle. -- Albert Einstein
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="home-newsletter">
        <div className="container home-newsletter-inner">
          <p className="section-label" style={{ color: 'var(--accent-warm)' }}>Newsletter</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            color: 'var(--cream)',
            marginBottom: 16,
          }}>Stay in the loop</h2>
          <p style={{ color: 'var(--ink-faint)', marginBottom: 36, lineHeight: 1.7 }}>
            I write about web development, software architecture, and lessons learned.
            No spam — just thoughtful posts when I have something worth sharing.
          </p>

          {status === 'success' ? (
            <p style={{ color: 'var(--accent-warm)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              ✓ {msg}
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  flex: 1, padding: '14px 20px',
                  fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                  background: 'rgba(245,240,234,0.08)',
                  border: '1.5px solid rgba(245,240,234,0.2)',
                  borderRight: 'none',
                  color: 'var(--cream)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-accent"
                style={{ whiteSpace: 'nowrap', borderLeft: 'none' }}
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p style={{ color: '#e07340', marginTop: 12, fontSize: '0.875rem' }}>{msg}</p>
          )}
        </div>
      </section>
    </div>
  );
}
