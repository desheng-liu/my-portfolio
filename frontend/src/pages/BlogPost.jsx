import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API}/posts/${slug}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: 160 }}>
      <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>Loading…</p>
    </div>
  );

  if (notFound || !post) return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 160, gap: 20 }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Post not found.</p>
      <Link to="/blog" className="btn">← Back to Blog</Link>
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Link to="/blog" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-muted)', letterSpacing: '0.04em', display: 'inline-block', marginBottom: 48 }}>
            ← Back to Blog
          </Link>

          <header style={{ marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid var(--cream-dark)' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {(post.tags || []).map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 20,
            }}>{post.title}</h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
              {new Date(post.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>

          <article style={{ lineHeight: 1.8 }}>
            <style>{`
              article h1, article h2, article h3 {
                font-family: var(--font-display); font-weight: 400;
                letter-spacing: -0.02em; margin: 2em 0 0.5em; line-height: 1.2;
              }
              article h2 { font-size: 1.8rem; }
              article h3 { font-size: 1.3rem; }
              article p { margin-bottom: 1.4em; color: var(--ink-muted); }
              article a { color: var(--accent); border-bottom: 1px solid; }
              article code {
                font-family: var(--font-mono); font-size: 0.85em;
                background: var(--cream-dark); padding: 2px 6px;
              }
              article pre {
                background: var(--ink); color: var(--cream);
                padding: 24px; overflow-x: auto; margin: 2em 0;
              }
              article pre code { background: none; padding: 0; color: inherit; }
              article blockquote {
                border-left: 3px solid var(--accent); padding-left: 20px;
                margin: 2em 0; color: var(--ink-muted); font-style: italic;
              }
              article ul, article ol { padding-left: 24px; margin-bottom: 1.4em; }
              article li { color: var(--ink-muted); margin-bottom: 6px; }
              article img { width: 100%; margin: 2em 0; }
              article hr { border: none; border-top: 1px solid var(--cream-dark); margin: 2.5em 0; }
            `}</style>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
