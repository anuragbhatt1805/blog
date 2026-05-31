import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { User, Clock, ArrowRight, Globe, ExternalLink } from 'lucide-react'

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const authorId = resolvedParams.id
  const supabase = await createClient()

  const { data: author, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authorId)
    .single()

  if (error || !author) {
    notFound()
  }

  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, slug, title, subtitle, thumbnail_url, read_time_minutes, created_at')
    .eq('author_id', authorId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  const socials = [
    { url: author.website, label: 'Website', icon: <Globe size={16} /> },
    { url: author.twitter, label: 'Twitter', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> },
    { url: author.github, label: 'GitHub', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> },
    { url: author.linkedin, label: 'LinkedIn', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> },
  ].filter(s => s.url)

  return (
    <div className="app-container" style={{ maxWidth: '800px', padding: '4rem 1.5rem' }}>
      {/* Author Header */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="avatar-circle" style={{ width: '5rem', height: '5rem', border: '2px solid var(--primary)', flexShrink: 0 }}>
          {author.avatar_url ? (
            <img src={author.avatar_url} alt={author.name || ''} />
          ) : (
            <User size={28} style={{ color: 'var(--text-muted)' }} />
          )}
        </div>
        <div>
          <h1 className="heading-lg" style={{ marginBottom: '0.25rem' }}>{author.name || 'Anonymous'}</h1>
          {author.bio && (
            <p className="paragraph-md" style={{ marginBottom: '0.75rem' }}>{author.bio}</p>
          )}
          {/* Social Links */}
          {socials.length > 0 && (
            <div className="flex-row-gap" style={{ gap: '0.75rem' }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url!.startsWith('http') ? s.url! : `https://${s.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-icon"
                  title={s.label}
                  style={{ color: 'var(--text-muted)', padding: '0.375rem' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="divider" />

      {/* Author's Articles */}
      <h2 className="heading-md" style={{ marginBottom: '1.5rem' }}>
        Journals by {author.name || 'this author'}
      </h2>

      {blogs && blogs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {blogs.map((blog: any) => (
            <Link key={blog.id} href={`/blogs/${blog.slug || blog.id}`} style={{ display: 'block' }}>
              <div style={{ 
                padding: '1.25rem 0', 
                borderBottom: '1px solid var(--border)', 
                cursor: 'pointer', 
                transition: 'opacity 0.2s',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start'
              }}>
                {blog.thumbnail_url && (
                  <img src={blog.thumbnail_url} alt="" style={{ width: '120px', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex-row-gap paragraph-sm" style={{ marginBottom: '0.375rem', gap: '0.5rem' }}>
                  <span className="flex-center" style={{ gap: '0.25rem' }}>
                    <Clock size={13} />
                    {blog.read_time_minutes} min
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3 className="heading-sm" style={{ marginBottom: '0.25rem' }}>{blog.title}</h3>
                {blog.subtitle && (
                  <p className="paragraph-sm" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {blog.subtitle}
                  </p>
                )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="paragraph-md">No published journals yet.</p>
      )}
    </div>
  )
}
