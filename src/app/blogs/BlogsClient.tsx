'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Clock, FileText, User } from 'lucide-react'

export default function BlogsClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    initialBlogs.forEach(blog => {
      (blog.tags || []).forEach((t: string) => tagSet.add(t))
    })
    return Array.from(tagSet).sort()
  }, [initialBlogs])

  const filteredBlogs = initialBlogs.filter(blog => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      blog.title.toLowerCase().includes(q) ||
      (blog.subtitle || '').toLowerCase().includes(q)
    const matchesTag = !activeTag || (blog.tags || []).includes(activeTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="app-container" style={{ padding: '4rem 1.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '3rem' }}>
        <span className="eyebrow" style={{ marginBottom: '0.75rem', display: 'block' }}>
          The Journal
        </span>
        <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>All journals</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          Explore the complete collection of dispatches.
        </p>
      </div>

      {/* Filter Bar */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={13}
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="form-input-underline"
              placeholder="SEARCH BY TITLE OR TOPIC…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {allTags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={() => setActiveTag(null)}
                className={activeTag === null ? 'badge badge-accent' : 'badge'}
                style={{ cursor: 'pointer' }}
              >
                All works
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={activeTag === tag ? 'badge badge-accent' : 'badge'}
                  style={{ cursor: 'pointer' }}
                >
                  {tag}
                </button>
              ))}
              <span
                style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--text-muted)',
                }}
              >
                {filteredBlogs.length} works
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Masonry Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="masonry">
          {filteredBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug || blog.id}`}
              style={{
                display: 'block',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--card-bg)',
                transition: 'border-color 0.3s ease',
              }}
            >
              {blog.thumbnail_url ? (
                <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                  <img
                    src={blog.thumbnail_url}
                    alt={blog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                  />
                </div>
              ) : (
                <div style={{
                  aspectRatio: '16/10',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <FileText size={28} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                </div>
              )}
              <div style={{ padding: '1.25rem 1.25rem 1.5rem' }}>
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
                  <span>
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="heading-md" style={{
                  marginBottom: '0.5rem',
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {blog.title}
                </h3>

                <p style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.55,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                }}>
                  {blog.subtitle}
                </p>

                {blog.tags && blog.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1rem' }}>
                    {blog.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="badge" style={{ padding: '0.25rem 0.5rem', fontSize: '0.5625rem' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border)',
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
        <div style={{ padding: '5rem 0', textAlign: 'center' }}>
          <FileText size={36} style={{ margin: '0 auto 1rem', opacity: 0.3, color: 'var(--text-muted)' }} />
          <p className="paragraph-sm" style={{ marginBottom: '1rem' }}>
            {searchQuery || activeTag ? 'No journals match your filters.' : 'No journals published yet.'}
          </p>
          {activeTag && (
            <button onClick={() => setActiveTag(null)} className="btn btn-outline btn-sm">
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  )
}
