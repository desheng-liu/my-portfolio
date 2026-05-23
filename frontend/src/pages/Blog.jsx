import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/posts`)
      .then(r => r.json())
      .then(data => {
        // Accept either an array response or an object with `posts` array
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (data && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          console.error('Unexpected posts response from API:', data);
          setPosts([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch posts', err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 80, paddingBottom: 100 }}>
        <div style={{ marginBottom: 56 }}>
          <p className="section-label">Writing</p>
          <h1 className="section-title" style={{ marginBottom: 16 }}>Blog</h1>
          <div className="divider" />
          <p style={{ color: 'var(--ink-muted)', maxWidth: 520, lineHeight: 1.7 }}>
            Thoughts on software engineering, architecture, and things I'm learning.
          </p>
        </div>

        {loading && (
          <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>Loading posts…</p>
        )}

        {!loading && posts.length === 0 && (
          <div style={{ padding: '60px 0', color: 'var(--ink-muted)' }}>
            <p>No posts yet — check back soon!</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(Array.isArray(posts) ? posts : []).map((post, i) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: 32,
                alignItems: 'start',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                  color: 'var(--ink-faint)', letterSpacing: '0.04em',
                }}>
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, marginBottom: 8, lineHeight: 1.3 }}>
                  {post.title}
                </h2>
                <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 12 }}>
                  {post.excerpt}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(post.tags || []).map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
