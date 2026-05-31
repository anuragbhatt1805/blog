import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Clock, Bookmark, ArrowRight } from 'lucide-react'

export default async function SavedBlogsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: savedItems } = await supabase
    .from('blog_saves')
    .select(`
      blog_id,
      created_at,
      blogs:blog_id (
        id,
        slug,
        title,
        subtitle,
        read_time_minutes,
        created_at,
        tags,
        thumbnail_url,
        profiles:author_id (name)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const savedBlogs = (savedItems || [])
    .map((item: any) => item.blogs)
    .filter(Boolean)

  return (
    <div className="app-container" style={{ maxWidth: '800px', padding: '4rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="flex-row-gap" style={{ gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Bookmark size={24} style={{ color: 'var(--primary)' }} />
          <h1 className="heading-lg" style={{ marginBottom: 0 }}>Saved Journals</h1>
        </div>
        <p className="paragraph-md">Journals you&apos;ve bookmarked for later.</p>
      </div>

      {savedBlogs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {savedBlogs.map((blog: any) => blog && (
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
                  <span>{blog.profiles?.name || 'Anonymous'}</span>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <span className="flex-center" style={{ gap: '0.25rem' }}>
                    <Clock size={13} />
                    {blog.read_time_minutes} min
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <h3 className="heading-sm" style={{ marginBottom: '0.25rem' }}>{blog.title}</h3>
                {blog.subtitle && (
                  <p className="paragraph-sm" style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 1, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden' 
                  }}>
                    {blog.subtitle}
                  </p>
                )}
                {blog.tags && blog.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
                    {blog.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="badge" style={{ marginBottom: 0, fontSize: '0.688rem', padding: '0.125rem 0.4rem' }}>{tag}</span>
                    ))}
                  </div>
                )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center" style={{ padding: '5rem 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-xl)' }}>
          <Bookmark size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, color: 'var(--text-muted)' }} />
          <p className="paragraph-lg" style={{ marginBottom: '1rem' }}>No saved journals yet.</p>
          <Link href="/blogs" className="btn btn-outline btn-sm">
            Browse journals <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  )
}
