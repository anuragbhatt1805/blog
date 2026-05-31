import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, Clock, FileText, User } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  const { data: latestBlogs } = await supabase
    .from('blogs')
    .select(`
      id,
      slug,
      title,
      subtitle,
      read_time_minutes,
      created_at,
      thumbnail_url,
      profiles:author_id (name, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: totalBlogs } = await supabase
    .from('blogs')
    .select('id', { count: 'exact', head: true })

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })

  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
  const cfg: Record<string, string> = {}
  settingsData?.forEach((s: any) => { cfg[s.key] = s.value })

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="app-container">
          <span className="eyebrow animate-fade-up" style={{ marginBottom: '1.5rem', display: 'block' }}>
            Vol. 01 — Editorial Journal
          </span>
          <h1 className="heading-xl animate-fade-up animate-fade-up-delay-1" style={{ marginBottom: '1.5rem', maxWidth: '20ch' }}>
            Signals from the architecture.
          </h1>
          <p
            className="animate-fade-up animate-fade-up-delay-2"
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.6,
              color: 'var(--text-muted)',
              maxWidth: '38rem',
              marginBottom: '2.5rem',
            }}
          >
            Deep-dive technical essays, system design teardowns, and engineering
            metrics — measuring the art of modern software.
          </p>

          <div className="animate-fade-up animate-fade-up-delay-3" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/blogs" className="btn btn-primary btn-lg">
              Browse the journal <ArrowRight size={14} />
            </Link>
            <Link href="/signup" className="btn btn-outline btn-lg">Join</Link>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div
          className="app-container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            padding: '3rem 1.5rem',
          }}
        >
          <div>
            <div className="stat-number">{String(totalBlogs || 0).padStart(2, '0')}</div>
            <div className="stat-label">Published articles</div>
          </div>
          <div>
            <div className="stat-number">{String(totalUsers || 0).padStart(2, '0')}</div>
            <div className="stat-label">Community members</div>
          </div>
          <div>
            <div className="stat-number">∞</div>
            <div className="stat-label">Topics covered</div>
          </div>
        </div>
      </section>

      {/* ── About Author ── */}
      <section className="section-padding">
        <div className="app-container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '7rem', height: '7rem', borderRadius: '50%',
              border: '1px solid var(--border-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-1)', flexShrink: 0,
            }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--foreground)' }}>
                {cfg.author_avatar_letter || 'A'}
              </span>
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <span className="eyebrow" style={{ marginBottom: '0.75rem', display: 'block' }}>
                About the Author
              </span>
              <h2 className="heading-lg" style={{ marginBottom: '0.75rem' }}>
                Hi, I&apos;m {cfg.author_name || 'the Author'}
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-muted)' }}>
                {cfg.author_bio || 'Welcome to my editorial engineering journal.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest Articles ── */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="app-container">
          <div className="flex-between" style={{ marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="eyebrow" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Recent dispatches
              </span>
              <h2 className="heading-lg" style={{ marginBottom: 0 }}>Latest articles</h2>
            </div>
            <Link href="/blogs" className="btn btn-outline btn-sm">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {latestBlogs?.length ? (
            <div className="masonry">
              {latestBlogs.map((blog: any) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug || blog.id}`}
                  className="group"
                  style={{
                    display: 'block',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    background: 'var(--card-bg)',
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  {blog.thumbnail_url && (
                    <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                      <img
                        src={blog.thumbnail_url}
                        alt={blog.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '1.25rem' }}>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      color: 'var(--text-muted)',
                      marginBottom: '0.75rem',
                    }}>
                      <Clock size={11} />
                      <span>{blog.read_time_minutes} min</span>
                      <span>·</span>
                      <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="heading-md" style={{ marginBottom: '0.5rem', lineHeight: 1.2 }}>
                      {blog.title}
                    </h3>
                    <p style={{
                      fontSize: '0.9375rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.55,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                    }}>
                      {blog.subtitle}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      color: 'var(--text-muted)',
                    }}>
                      <div className="avatar-circle" style={{ width: '1.25rem', height: '1.25rem' }}>
                        {blog.profiles?.avatar_url ? (
                          <img src={blog.profiles.avatar_url} alt="" />
                        ) : (
                          <User size={10} />
                        )}
                      </div>
                      <span>{blog.profiles?.name || 'Anonymous'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '5rem 0',
              textAlign: 'center',
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}>
              <FileText size={36} style={{ margin: '0 auto 1rem', opacity: 0.3, color: 'var(--text-muted)' }} />
              <p className="paragraph-sm">The journal is empty — check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
