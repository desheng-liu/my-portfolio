import React, { useEffect, useState } from 'react';

// ── Set your GitHub username here ──
const GITHUB_USERNAME = 'desheng-liu';
// Optionally pin specific repos (by name) to show first. Leave empty to show all.
const PINNED = ['my-cool-project', 'another-project'];
// ───────────────────────────────────

const LANG_COLORS = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572a5',
  Rust: '#dea584', Go: '#00add8', HTML: '#e34c26', CSS: '#563d7c',
  Shell: '#89e051', Java: '#b07219', 'C++': '#f34b7d', default: '#8b949e',
};

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function ForkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
      <path d="M6 9v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9"/>
    </svg>
  );
}

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`)
      .then(r => {
        if (!r.ok) throw new Error('GitHub API error');
        return r.json();
      })
      .then(data => {
        const filtered = data.filter(r => !r.fork && !r.archived);
        // Sort pinned repos first
        const sorted = filtered.sort((a, b) => {
          const ai = PINNED.indexOf(a.name), bi = PINNED.indexOf(b.name);
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
          return new Date(b.updated_at) - new Date(a.updated_at);
        });
        setRepos(sorted);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const languages = ['All', ...new Set(repos.map(r => r.language).filter(Boolean))];
  const visible = filter === 'All' ? repos : repos.filter(r => r.language === filter);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 80, paddingBottom: 100 }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <p className="section-label">Open Source</p>
          <h1 className="section-title" style={{ marginBottom: 16 }}>Projects</h1>
          <div className="divider" />
          <p style={{ color: 'var(--ink-muted)', maxWidth: 560, lineHeight: 1.7 }}>
            A collection of things I've built and open-sourced. Click any card to view the repository.
          </p>
        </div>

        {/* Language filter */}
        {!loading && !error && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
            {languages.map(lang => (
              <button
                key={lang}
                onClick={() => setFilter(lang)}
                style={{
                  padding: '6px 14px',
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                  letterSpacing: '0.06em',
                  border: '1px solid',
                  borderColor: filter === lang ? 'var(--ink)' : 'var(--cream-dark)',
                  background: filter === lang ? 'var(--ink)' : 'transparent',
                  color: filter === lang ? 'var(--cream)' : 'var(--ink-muted)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        )}

        {/* States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-muted)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>Loading repositories…</p>
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
              Could not load GitHub repos. Make sure GITHUB_USERNAME is set correctly.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {visible.map(repo => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="card"
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {PINNED.includes(repo.name) && (
                  <span className="tag" style={{ alignSelf: 'flex-start', borderColor: 'var(--accent)', color: 'var(--accent)' }}>Featured</span>
                )}
                <div>
                  <h3 style={{ fontWeight: 500, marginBottom: 6, fontSize: '1rem' }}>{repo.name}</h3>
                  <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {repo.description || 'No description provided.'}
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                  {repo.language && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: LANG_COLORS[repo.language] || LANG_COLORS.default,
                        flexShrink: 0,
                      }}/>
                      {repo.language}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarIcon />{repo.stargazers_count}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ForkIcon />{repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <p style={{ color: 'var(--ink-muted)', textAlign: 'center', padding: '60px 0' }}>No projects found for this filter.</p>
        )}
      </div>
    </div>
  );
}
