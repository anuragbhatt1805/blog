import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { User } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="navbar">
      <div className="app-container navbar-inner">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" className="brand-logo">
            Telemetry
          </Link>
          <div className="nav-links">
            <Link href="/blogs" className="nav-link">Journal</Link>
            {user && <Link href="/saved" className="nav-link">Saved</Link>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ThemeToggle />
          {user ? (
            <Link href="/profile" className="btn btn-outline btn-sm" title="Profile" aria-label="Profile">
              <User size={14} />
              <span style={{ display: 'inline-flex' }}>Profile</span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="nav-link">Login</Link>
              <Link href="/signup" className="btn btn-primary btn-sm">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
