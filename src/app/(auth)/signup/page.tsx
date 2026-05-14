import { signup, signInWithProvider } from '../actions'
import Link from 'next/link'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <div style={{ minHeight: 'calc(100vh - 130px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--hero-gradient)', zIndex: -1 }} />
      
      <div className="saas-card-static animate-fade-up" style={{ width: '100%', maxWidth: '26rem', padding: '2.5rem' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <h1 className="heading-md" style={{ marginBottom: '0.5rem' }}>Create your account</h1>
          <p className="paragraph-md">Join our community of developers</p>
        </div>
        
        {params?.error && (
          <div className="error-box">{params.error}</div>
        )}
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="name">Full Name</label>
            <input className="form-input" id="name" name="name" type="text" required placeholder="John Doe" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="email">Email</label>
            <input className="form-input" id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input className="form-input" id="password" name="password" type="password" required placeholder="••••••••" />
          </div>
          <button formAction={signup} className="btn btn-primary btn-full" style={{ marginTop: '0.25rem' }}>
            Create Account
          </button>
        </form>
        
        <div style={{ position: 'relative', margin: '1.75rem 0' }}>
          <div className="divider" style={{ margin: 0 }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '0 0.75rem', background: 'var(--surface-1)', fontSize: '0.813rem', color: 'var(--text-muted)' }}>
            or
          </div>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <button formAction={signInWithProvider.bind(null, 'github')} className="btn btn-outline btn-full" style={{ justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            Continue with GitHub
          </button>
          <button formAction={signInWithProvider.bind(null, 'google')} className="btn btn-outline btn-full" style={{ justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
            Continue with Google
          </button>
        </form>
        
        <p className="text-center paragraph-sm" style={{ marginTop: '2rem' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
