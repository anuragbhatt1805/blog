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
    <footer className="w-full py-16 md:py-24 border-t border-border mt-12">
      <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        {/* Brand */}
        <div className="md:col-span-5 flex flex-col justify-between gap-8">
          <div className="space-y-3">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground tracking-tight">
              Telemetry
            </h2>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Editorial Engineering Archive
            </p>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Deep-dive technical essays, system design teardowns, and engineering notes from the field.
          </p>
        </div>

        {/* Navigation */}
        <div className="md:col-span-3 space-y-6">
          <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">
            Navigation
          </h3>
          <ul className="space-y-4 font-mono">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center text-sm uppercase tracking-wider text-foreground hover:text-muted-foreground transition-colors duration-300"
                >
                  <span>{l.label}</span>
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className="md:col-span-4 space-y-6">
          <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">
            Social Presence
          </h3>
          <ul className="space-y-4 font-mono">
            {socialLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center text-sm uppercase tracking-wider text-foreground hover:text-muted-foreground transition-colors duration-300"
                >
                  <span>{l.label}</span>
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full-width hairline separator */}
      <div className="mt-16 md:mt-20 border-t border-border" />
      <div className="px-4 sm:px-6 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          © {new Date().getFullYear()} Bhatt Dev
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          Built for technical storytelling
        </span>
      </div>
    </footer>
  )
}
