import React from 'react';

const RESUME = {
  name: 'Desheng Liu',
  title: 'Software Engineer',
  email: 'deshengliu9203@gmail.com',
  location: 'Dallas, TX',
  github: 'github.com/desheng-liu',
  linkedin: 'linkedin.com/in/liudesheng',
  experience: [
    {
      company: 'JPMorgan Chase & Co.',
      role: 'Software Engineering Intern',
      period: 'Jun 2024 - Aug 2024',
      location: 'Austin, TX',
      bullets: [
        'Developed a failure process management microservice using Java Spring that automates error handling and performs real-time monitoring for multiple internal systems, enhancing system reliability by 30%',
        'Created RESTful APIs and Kafka event streamers to facilitate seamless data processing and integration with a SQL database, enabling efficient management of failure processes and time logs',
        'Maintained 100% code coverage, deployed the application on AWS servers, and utilized CI/CD Jenkins pipelines to ensure reliable deployment to production',
      ],
    },
    {
      company: 'JPMorgan Chase & Co.',
      role: 'Software Engineering Intern',
      period: 'Jun 2023 - Aug 2023',
      location: 'Houston, TX',
      bullets: [
        'Developed a cloud-native, full-stack feature on a product catalog management system, enabling seamless creation and revision of banking services for clients with multi-million dollar assets',
        'Achieved a 100% reduction in turnaround time from 30 days to real-time, allowing client advisors to modify product configurations instantly, ultimately cutting operation pain points and AWS server costs',
        'Created dynamic user interfaces and RESTful APIs using React and Java Spring, improving user interaction and functionality with the product configuration display',
        'Maintained 100% code coverage and deployed the application to production on AWS servers with 100+ active business analyst users',
      ],
    },
    {
      company: 'Southwest Airlines',
      role: 'Software Engineering Intern',
      period: 'Jan 2024 - Apr 2024',
      location: 'Dallas (Remote), TX',
      bullets: [
        'Implemented an Award & Badges prototype feature for southwest.com, enhancing user engagement by rewarding frequent flyers with incentives that provide in-flight benefits',
        'Designed user interface components using React and developed event-driven processes and RESTful APIs using AWS Lambda and Flask, ensuring seamless integration between the frontend and backend systems',
      ],
    },
    {
      company: 'Lockheed Martin',
      role: 'Software Engineering Intern',
      period: 'Jun 2022 - Aug 2022',
      location: 'Mount Laurel, NJ',
      bullets: [
        'Developed a real-time data health monitor service aimed at detecting database failures and overload spikes, reducing manual testing errors and the quality assurance (QA) testing workflow timeline by 30%',
        'Created RESTful APIs using Flask and Python to database health logs from a MongoDB database',
      ],
    },
  ],
  projects: [
    {
      name: 'MockHelp',
      stack: ['TypeScript', 'Next.js', 'Python', 'Flask', 'PostgreSQL', 'ChakraUI', 'GPT-4 Turbo API'],
      bullets: [
        'Developed a full-stack web application that empowers tech industry professionals to improve technical and behavioral interviewing skills through AI-driven mock interviews, delivering personalized, human-like feedback for a realistic interview simulation experience',
      ],
    },
  ],
  education: [
    {
      school: 'The University of Texas at Austin',
      degree: 'B.S. in Electrical and Computer Engineering, Certificate in Data Sciences',
      period: 'Expected May 2026',
      note: 'GPA: 3.8 / 4.0',
      location: 'Austin, TX',
      coursework:
        'Data Structures & Algorithms, Software Design and Web Development, Software Security & Privacy, Discrete Math',
    },
  ],
  skills: {
    Languages: ['Java', 'Python', 'JavaScript', 'C', 'C++', 'Bash', 'Assembly', 'HTML/CSS', 'SQL'],
    'Frameworks/Libraries': ['React', 'Spring', 'Flask', 'DynamoDB', 'MongoDB', 'H2 Database'],
    'Methodologies and Tools': [
      'Git',
      'Linux',
      'CI/CD',
      'Jenkins',
      'Agile Development',
      'Atlassian Products',
      'AWS Lambda',
    ],
  },
  leadership: [
    'Student Engineers Educating Kids (SEEK) Mentor',
    'UT Austin University Orchestra Concertmaster',
    'Intramural Basketball',
  ],
};

function Section({ label, children }) {
  return (
    <section style={{ marginBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
        <p className="section-label" style={{ marginBottom: 0 }}>
          {label}
        </p>
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
        <div className="resume-header">
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {RESUME.name}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--accent)', fontWeight: 500 }}>{RESUME.title}</p>
          </div>
          <div className="resume-contact">
            <a href={`mailto:${RESUME.email}`} style={{ color: 'var(--accent)' }}>
              {RESUME.email}
            </a>
            <span>{RESUME.location}</span>
            <a href={`https://${RESUME.github}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false" style={{ flexShrink: 0 }}>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              {RESUME.github}
            </a>
            <a href={`https://${RESUME.linkedin}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" style={{ flexShrink: 0 }}>
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h5v2.2h.1c.7-1.2 2.4-2.2 4.9-2.2 5.2 0 6.9 3.4 6.9 7.8V24h-5v-8.9c0-2.2-.04-5-3-5-3 0-3.5 2.4-3.5 4.9V24H8V8z" />
              </svg>
              {RESUME.linkedin}
            </a>
          </div>
        </div>

        <div style={{ marginBottom: 48, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn" style={{ fontSize: '0.8rem' }}>
            View PDF
          </a>
        </div>

        <Section label="Experience">
          {RESUME.experience.map((job, i) => (
            <div key={i} className="card" style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
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
                {job.bullets.map((bullet, idx) => (
                  <li key={idx} style={{ color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: 4 }}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section label="Education">
          {RESUME.education.map((edu, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontWeight: 500 }}>{edu.degree}</span>
                  <span style={{ color: 'var(--ink-muted)', margin: '0 8px' }}>·</span>
                  <span style={{ color: 'var(--accent)' }}>{edu.school}</span>
                  {edu.note && (
                    <span style={{ color: 'var(--ink-faint)', marginLeft: 12, fontSize: '0.875rem' }}>
                      {edu.note}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 16, color: 'var(--ink-muted)', fontSize: '0.875rem' }}>
                  {edu.location && <span>{edu.location}</span>}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{edu.period}</span>
                </div>
              </div>
              {edu.coursework && (
                <p style={{ color: 'var(--ink-muted)', marginTop: 12, lineHeight: 1.6 }}>
                  <strong>Coursework:</strong> {edu.coursework}
                </p>
              )}
            </div>
          ))}
        </Section>

        <Section label="Projects">
          {RESUME.projects.map((project, i) => (
            <div key={i} className="card" style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontWeight: 500, fontSize: '1.05rem' }}>{project.name}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {project.stack.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
              <ul style={{ paddingLeft: 20, marginTop: 0 }}>
                {project.bullets.map((bullet, idx) => (
                  <li key={idx} style={{ color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: 4 }}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section label="Skills">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {Object.entries(RESUME.skills).map(([category, items]) => (
              <div
                key={category}
                style={{ padding: '20px 24px', background: 'var(--white)', border: '1px solid var(--cream-dark)' }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    color: 'var(--accent)',
                    marginBottom: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  {category}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {items.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Leadership and Community Involvement">
          <div className="card">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {RESUME.leadership.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
