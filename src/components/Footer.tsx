const navLinks = [
  { url: 'https://bhattdev.in', label: 'Portfolio' },
  { url: 'https://telemetry.bhattdev.in', label: 'Telemetry' },
  { url: 'https://archive.bhattdev.in', label: 'Archive' },
]

const socialLinks = [
  { url: 'https://www.instagram.com/lumen_archive_posts', label: 'Instagram' },
  { url: 'https://github.com/anuragbhatt1805', label: 'GitHub' },
  { url: 'https://www.linkedin.com/in/anuragbhatt1805', label: 'LinkedIn' },
]

export default async function Footer() {
  return (
    <footer className="lumen-footer">
      <div className="lumen-footer-grid">
        {/* Brand */}
        <div className="lumen-footer-brand">
          <div>
            <h2 className="lumen-footer-title">Telemetry</h2>
            <p className="lumen-footer-eyebrow" style={{ marginTop: '0.75rem' }}>
              Editorial Engineering Archive
            </p>
          </div>
          <p className="lumen-footer-tagline">
            Deep-dive technical essays, system design teardowns, and engineering notes from the field.
          </p>
        </div>

        {/* Navigation */}
        <div className="lumen-footer-col lumen-footer-col-nav">
          <h3 className="lumen-footer-eyebrow lumen-footer-heading">Navigation</h3>
          <ul className="lumen-footer-list">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="lumen-footer-link">
                  <span>{l.label}</span>
                  <span className="lumen-footer-arrow">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className="lumen-footer-col lumen-footer-col-social">
          <h3 className="lumen-footer-eyebrow lumen-footer-heading">Social Presence</h3>
          <ul className="lumen-footer-list">
            {socialLinks.map((l) => (
              <li key={l.label}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="lumen-footer-link">
                  <span>{l.label}</span>
                  <span className="lumen-footer-arrow">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lumen-footer-divider" />
      <div className="lumen-footer-bottom">
        <span className="lumen-footer-eyebrow">© {new Date().getFullYear()} Bhatt Dev</span>
        <span className="lumen-footer-eyebrow">Built for technical storytelling</span>
      </div>

      <style>{`
        .lumen-footer {
          width: 100%;
          padding: 4rem 0 0;
          border-top: 1px solid var(--border);
          margin-top: 3rem;
        }
        .lumen-footer-grid {
          padding: 0 1rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        @media (min-width: 640px) {
          .lumen-footer { padding-top: 6rem; }
          .lumen-footer-grid { padding: 0 1.5rem; }
        }
        @media (min-width: 768px) {
          .lumen-footer-grid {
            grid-template-columns: repeat(12, 1fr);
            gap: 2rem;
          }
          .lumen-footer-brand { grid-column: span 5; }
          .lumen-footer-col-nav { grid-column: span 3; }
          .lumen-footer-col-social { grid-column: span 4; }
        }
        .lumen-footer-brand {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 2rem;
        }
        .lumen-footer-title {
          font-family: var(--font-serif);
          font-size: clamp(2.25rem, 4vw, 3rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1;
          color: var(--foreground);
          margin: 0;
        }
        .lumen-footer-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin: 0;
        }
        .lumen-footer-tagline {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--text-muted);
          max-width: 20rem;
          margin: 0;
        }
        .lumen-footer-col { display: flex; flex-direction: column; gap: 1.5rem; }
        .lumen-footer-heading { font-weight: 500; }
        .lumen-footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-family: var(--font-mono);
        }
        .lumen-footer-link {
          display: inline-flex;
          align-items: center;
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--foreground);
          transition: color 0.3s ease;
        }
        .lumen-footer-link:hover { color: var(--text-muted); }
        .lumen-footer-arrow {
          margin-left: 0.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .lumen-footer-link:hover .lumen-footer-arrow { opacity: 1; }
        .lumen-footer-divider {
          margin-top: 4rem;
          border-top: 1px solid var(--border);
        }
        @media (min-width: 768px) { .lumen-footer-divider { margin-top: 5rem; } }
        .lumen-footer-bottom {
          padding: 2rem 1rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.75rem;
        }
        @media (min-width: 640px) { .lumen-footer-bottom { padding: 2rem 1.5rem; } }
        @media (min-width: 768px) {
          .lumen-footer-bottom { flex-direction: row; align-items: center; }
        }
      `}</style>
    </footer>
  )
}
