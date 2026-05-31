import Link from 'next/link'

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
    <footer className="footer" style={{ paddingTop: '4rem' }}>
      <div className="app-container" style={{ paddingBottom: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
            paddingBottom: '4rem',
          }}
        >
          {/* Brand — 5/12 */}
          <div style={{ gridColumn: 'span 12 / span 12' }} className="footer-brand">
            <h2 className="brand-logo-lg" style={{ marginBottom: '0.75rem' }}>Telemetry</h2>
            <p
              className="paragraph-sm"
              style={{ marginBottom: '1.25rem' }}
            >
              Editorial Engineering Archive
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
              maxWidth: '20rem',
              lineHeight: 1.6,
            }}>
              Deep-dive technical essays, system design teardowns, and engineering notes from the field.
            </p>
          </div>

          {/* Navigation — 3/12 */}
          <div className="footer-col" style={{ gridColumn: 'span 12 / span 12' }}>
            <h3 className="paragraph-sm" style={{ marginBottom: '1.5rem', fontWeight: 500 }}>
              Navigation
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    <span>{l.label}</span>
                    <span className="footer-arrow">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social — 4/12 */}
          <div className="footer-col" style={{ gridColumn: 'span 12 / span 12' }}>
            <h3 className="paragraph-sm" style={{ marginBottom: '1.5rem', fontWeight: 500 }}>
              Social Presence
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {socialLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    <span>{l.label}</span>
                    <span className="footer-arrow">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            <span className="paragraph-sm" style={{ margin: 0 }}>
              © {new Date().getFullYear()} Telemetry
            </span>
            <span className="paragraph-sm" style={{ margin: 0 }}>
              Built for technical storytelling
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .footer-brand { grid-column: span 5 / span 5 !important; }
          .footer-col:nth-of-type(2) { grid-column: span 3 / span 3 !important; }
          .footer-col:nth-of-type(3) { grid-column: span 4 / span 4 !important; }
        }
        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--foreground);
          transition: color 0.3s ease;
        }
        .footer-link:hover { color: var(--text-muted); }
        .footer-arrow {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .footer-link:hover .footer-arrow { opacity: 1; }
      `}</style>
    </footer>
  )
}
