import React from 'react';

// ── Edit this data to customize your resume ──────────────────────────
const RESUME = {
  name: 'Your Name',
  title: 'Full-Stack Software Engineer',
  email: 'you@example.com',
  location: 'Texas, USA',
  github: 'github.com/yourusername',
  linkedin: 'linkedin.com/in/yourprofile',
  summary: `Software engineer with X years of experience building scalable web applications.
    Passionate about clean architecture, developer experience, and shipping high-quality products.`,
  experience: [
    {
      company: 'Company Name',
      role: 'Senior Software Engineer',
      period: '2022 – Present',
      location: 'Remote',
      bullets: [
        'Built and maintained microservices handling 50M+ requests/month',
        'Led migration from monolith to React + Node.js architecture',
        'Mentored 3 junior engineers and established code review standards',
      ],
    },
    {
      company: 'Previous Company',
      role: 'Software Engineer',
      period: '2019 – 2022',
      location: 'Dallas, TX',
      bullets: [
        'Developed REST APIs used by iOS and Android apps with 100k+ users',
        'Reduced CI/CD pipeline time by 40% through caching optimizations',
        'Implemented automated testing, bringing coverage from 20% to 85%',
      ],
    },
  ],
  education: [
    {
      school: 'University Name',
      degree: 'B.S. Computer Science',
      period: '2015 – 2019',
      note: 'Magna Cum Laude',
    },
  ],
  skills: {
    'Languages': ['JavaScript', 'TypeScript', 'Python', 'SQL'],
    'Frontend': ['React', 'HTML/CSS', 'Tailwind', 'Redux'],
    'Backend': ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    'Cloud / DevOps': ['AWS', 'Docker', 'GitHub Actions', 'Terraform'],
  },
};
// ─────────────────────────────────────────────────────────────────────

function Section({ label, children }) {
  return (
    <section style={{ marginBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
        <p className="section-label" style={{ marginBottom: 0 }}>{label}</p>
        <div style={{ flex: 1, height: 1, background: 'var(--cream-dark)' }} />
      </div>
      {children}
    </section>
  );
}

export default function Resume() {
  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 80, paddingBottom: 100 }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 64, paddingBottom: 48, borderBottom: '1px solid var(--cream-dark)',
          flexWrap: 'wrap', gap: 32,
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8,
            }}>{RESUME.name}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--accent)', fontWeight: 500 }}>{RESUME.title}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem', color: 'var(--ink-muted)', textAlign: 'right' }}>
            <a href={`mailto:${RESUME.email}`} style={{ color: 'var(--accent)' }}>{RESUME.email}</a>
            <span>{RESUME.location}</span>
            <a href={`https://${RESUME.github}`} target="_blank" rel="noreferrer">{RESUME.github}</a>
            <a href={`https://${RESUME.linkedin}`} target="_blank" rel="noreferrer">{RESUME.linkedin}</a>
          </div>
        </div>

        {/* Download button */}
        <div style={{ marginBottom: 48 }}>
          <a href="/resume.pdf" download className="btn" style={{ fontSize: '0.8rem' }}>
            ↓ Download PDF
          </a>
        </div>

        {/* Summary */}
        <Section label="Summary">
          <p style={{ color: 'var(--ink-muted)', lineHeight: 1.8, maxWidth: 680 }}>{RESUME.summary}</p>
        </Section>

        {/* Experience */}
        <Section label="Experience">
          {RESUME.experience.map((job, i) => (
            <div key={i} className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontWeight: 500, fontSize: '1.05rem' }}>{job.role}</span>
                  <span style={{ color: 'var(--ink-muted)', margin: '0 8px' }}>·</span>
                  <span style={{ color: 'var(--accent)' }}>{job.company}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, color: 'var(--ink-muted)', fontSize: '0.875rem' }}>
                  <span>{job.location}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{job.period}</span>
                </div>
              </div>
              <ul style={{ paddingLeft: 20, marginTop: 12 }}>
                {job.bullets.map((b, j) => (
                  <li key={j} style={{ color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: 4 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        {/* Education */}
        <Section label="Education">
          {RESUME.education.map((edu, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontWeight: 500 }}>{edu.degree}</span>
                  <span style={{ color: 'var(--ink-muted)', margin: '0 8px' }}>·</span>
                  <span style={{ color: 'var(--accent)' }}>{edu.school}</span>
                  {edu.note && <span style={{ color: 'var(--ink-faint)', marginLeft: 12, fontSize: '0.875rem' }}>{edu.note}</span>}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>{edu.period}</span>
              </div>
            </div>
          ))}
        </Section>

        {/* Skills */}
        <Section label="Skills">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {Object.entries(RESUME.skills).map(([category, items]) => (
              <div key={category} style={{ padding: '20px 24px', background: 'var(--white)', border: '1px solid var(--cream-dark)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase' }}>{category}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {items.map(item => <span key={item} className="tag">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
