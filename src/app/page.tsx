import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, BookOpen, Clock, Zap, Users, FileText } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  const { data: latestBlogs } = await supabase
    .from('blogs')
    .select(`
      id, 
      title, 
      subtitle, 
      read_time_minutes, 
      created_at,
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

  // Fetch site settings for the About section
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
  const cfg: Record<string, string> = {}
  settingsData?.forEach((s: any) => { cfg[s.key] = s.value })

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="hero-bg-gradient" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="app-container text-center">
          <div className="badge animate-fade-up" style={{ margin: '0 auto 1.5rem auto' }}>
            <Zap size={12} /> Next-Gen Blogging Platform
          </div>

          <h1 className="heading-xl animate-fade-up animate-fade-up-delay-1" style={{ marginBottom: '1.5rem' }}>
            Insights for the<br />
            <span style={{ color: 'var(--primary)' }}>Modern Developer</span>
          </h1>

          <p className="paragraph-lg animate-fade-up animate-fade-up-delay-2" style={{ maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
            Discover articles, tutorials, and deep dives on software engineering, 
            system design, and the future of web development.
          </p>

          <div className="flex-center animate-fade-up animate-fade-up-delay-3">
            <Link href="/blogs" className="btn btn-primary btn-lg">
              Explore Articles <ArrowRight size={18} />
            </Link>
            <Link href="/signup" className="btn btn-outline btn-lg">
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-1)' }}>
        <div className="app-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
          <div>
            <div className="stat-number">{totalBlogs || 0}</div>
            <div className="stat-label">Published Articles</div>
          </div>
          <div>
            <div className="stat-number">{totalUsers || 0}</div>
            <div className="stat-label">Community Members</div>
          </div>
          <div>
            <div className="stat-number">&infin;</div>
            <div className="stat-label">Topics Covered</div>
          </div>
        </div>
      </section>

      {/* ── About Author Section ── */}
      <section className="section-padding">
        <div className="app-container" style={{ maxWidth: '900px' }}>
          <div className="saas-card-flat" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap', padding: '2.5rem' }}>
            <div style={{ 
              width: '7rem', height: '7rem', borderRadius: '50%', 
              border: '2px solid var(--primary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              background: 'var(--surface-2)', flexShrink: 0, margin: '0 auto',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{cfg.author_avatar_letter || 'A'}</span>
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <div className="badge" style={{ marginBottom: '1rem' }}>About the Author</div>
              <h2 className="heading-lg" style={{ marginBottom: '0.75rem' }}>Hi, I&apos;m {cfg.author_name || 'the Author'}</h2>
              <p className="paragraph-lg">
                {cfg.author_bio || 'Welcome to my blog!'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest Blogs Section ── */}
      <section className="section-padding" style={{ background: 'var(--surface-1)' }}>
        <div className="app-container" style={{ maxWidth: '1000px' }}>
          <div className="flex-between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="heading-lg" style={{ marginBottom: '0.25rem' }}>Latest Articles</h2>
              <p className="paragraph-md">Fresh off the press</p>
            </div>
            <Link href="/blogs" className="btn btn-outline btn-sm">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {latestBlogs?.length ? (
            <div className="grid-featured">
              {latestBlogs.map((blog: any, i: number) => (
                <Link key={blog.id} href={`/blogs/${blog.id}`} style={{ display: 'block' }}>
                  <div className="saas-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div className="flex-row-gap paragraph-sm" style={{ marginBottom: '1rem' }}>
                      <span className="flex-center" style={{ gap: '0.25rem' }}>
                        <Clock size={14} />
                        {blog.read_time_minutes} min read
                      </span>
                      <span style={{ color: 'var(--border)' }}>·</span>
                      <span>
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <h3 className={i === 0 ? 'heading-lg' : 'heading-md'} style={{ marginBottom: '0.75rem', lineHeight: 1.3 }}>
                      {blog.title}
                    </h3>

                    <p className="paragraph-md" style={{ 
                      flexGrow: 1,
                      display: '-webkit-box', 
                      WebkitLineClamp: i === 0 ? 3 : 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden',
                      marginBottom: '1.25rem'
                    }}>
                      {blog.subtitle}
                    </p>

                    <div className="flex-row-gap" style={{ marginTop: 'auto' }}>
                      <span className="text-primary" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        Read article
                      </span>
                      <ArrowRight size={14} style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center" style={{ padding: '5rem 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-xl)' }}>
              <BookOpen size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3, color: 'var(--text-muted)' }} />
              <p className="paragraph-lg">No articles published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
