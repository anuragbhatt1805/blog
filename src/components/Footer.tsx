import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Activity } from 'lucide-react'

export default async function Footer() {
  const supabase = await createClient()
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['github_url', 'twitter_url', 'linkedin_url', 'contact_url'])

  const cfg: Record<string, string> = {}
  settingsData?.forEach((s: any) => { cfg[s.key] = s.value })

  const socials = [
    { url: cfg.github_url, label: 'GitHub' },
    { url: cfg.twitter_url, label: 'Twitter / X' },
    { url: cfg.linkedin_url, label: 'LinkedIn' },
    { url: cfg.contact_url, label: 'Contact' },
  ].filter(s => s.url)

  return (
    <footer className="footer">
      <div className="footer-accent" />
      <div className="app-container" style={{ padding: '3rem 1.5rem 2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div className="brand-logo" style={{ marginBottom: '1rem' }}>
              <Activity size={20} style={{ color: 'var(--accent)' }} />
              Telemetry
            </div>
            <p className="paragraph-sm" style={{ maxWidth: '260px' }}>
              Deep-dive technical essays, system design teardowns, and engineering metrics.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize: '0.813rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/blogs" className="nav-link">Articles</Link>
              <Link href="/login" className="nav-link">Sign in</Link>
            </div>
          </div>

          {/* Socials */}
          {socials.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.813rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Connect</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {socials.map(s => (
                  <a key={s.label} href={s.url!.startsWith('http') ? s.url! : `https://${s.url}`} target="_blank" rel="noopener noreferrer" className="nav-link">{s.label}</a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="divider" style={{ margin: '0 0 1.5rem 0' }} />
        
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <p className="paragraph-sm" style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} Telemetry. All rights reserved.
          </p>
          <p className="paragraph-sm" style={{ margin: 0 }}>
            Built with Next.js &amp; Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}
