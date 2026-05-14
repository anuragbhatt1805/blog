import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogIn, User } from 'lucide-react'
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
            DevBlog
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
