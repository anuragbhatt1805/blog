import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogIn, User, Activity } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="navbar">
      <div className="app-container navbar-inner">
        <div className="flex-center" style={{ gap: '0' }}>
          <Link href="/" className="brand-logo">
            <Activity size={24} style={{ color: 'var(--accent)' }} />
            Telemetry
          </Link>
          <div className="nav-links">
            <Link href="/blogs" className="nav-link">
              Articles
            </Link>
            {user && (
              <Link href="/saved" className="nav-link">
                Saved
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex-center" style={{ gap: '0.75rem' }}>
          <ThemeToggle />
          {user ? (
            <Link href="/profile" className="btn btn-ghost btn-icon" title="Profile" style={{ borderRadius: 'var(--radius-full)' }}>
              <User size={18} />
            </Link>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              <LogIn size={16} />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
