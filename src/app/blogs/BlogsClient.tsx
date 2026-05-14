'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Clock, ArrowRight, FileText } from 'lucide-react'

export default function BlogsClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // Collect all unique tags across all blogs
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    initialBlogs.forEach(blog => {
      (blog.tags || []).forEach((t: string) => tagSet.add(t))
    })
    return Array.from(tagSet).sort()
  }, [initialBlogs])

  const filteredBlogs = initialBlogs.filter(blog => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !activeTag || (blog.tags || []).includes(activeTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="app-container" style={{ maxWidth: '1000px', padding: '4rem 1.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-lg" style={{ marginBottom: '0.25rem' }}>All Articles</h1>
        <p className="paragraph-md">Explore our complete collection of insights.</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
        </div>
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.75rem', background: 'var(--surface-1)' }}
          placeholder="Search articles by title or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTag(null)}
            className={activeTag === null ? 'badge' : 'badge'}
            style={{
              cursor: 'pointer',
              marginBottom: 0,
              background: activeTag === null ? 'var(--primary)' : undefined,
              color: activeTag === null ? 'var(--text-inverse)' : undefined,
              borderColor: activeTag === null ? 'var(--primary)' : undefined,
            }}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className="badge"
              style={{
                cursor: 'pointer',
                marginBottom: 0,
                background: activeTag === tag ? 'var(--primary)' : undefined,
                color: activeTag === tag ? 'var(--text-inverse)' : undefined,
                borderColor: activeTag === tag ? 'var(--primary)' : undefined,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid-cards">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <Link key={blog.id} href={`/blogs/${blog.id}`} style={{ display: 'block', height: '100%' }}>
              <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="flex-row-gap paragraph-sm" style={{ marginBottom: '0.75rem' }}>
                  <span className="flex-center" style={{ gap: '0.25rem' }}>
                    <Clock size={14} />
                    {blog.read_time_minutes} min read
                  </span>
                  <span style={{ color: 'var(--border)' }}>·</span>
                  <span>
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>

                <h3 className="heading-md" style={{
                  marginBottom: '0.5rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.35
                }}>
                  {blog.title}
                </h3>

                <p className="paragraph-md" style={{
                  flexGrow: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  {blog.subtitle}
                </p>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                    {blog.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="badge" style={{ marginBottom: 0, fontSize: '0.688rem', padding: '0.15rem 0.5rem' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex-row-gap" style={{ marginTop: 'auto' }}>
                  <span className="text-primary" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    Read article
                  </span>
                  <ArrowRight size={14} style={{ color: 'var(--primary)' }} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '5rem 0', textAlign: 'center' }}>
            <FileText size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3, color: 'var(--text-muted)' }} />
            <p className="paragraph-lg">
              {searchQuery || activeTag ? `No articles found.` : 'No articles published yet.'}
            </p>
            {activeTag && (
              <button onClick={() => setActiveTag(null)} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
