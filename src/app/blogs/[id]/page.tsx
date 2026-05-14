import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BlogActions from './BlogActions'
import BlogContent from './BlogContent'
import { Clock, User, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const blogId = resolvedParams.id;
  const supabase = await createClient()

  const { data: blog, error } = await supabase
    .from('blogs')
    .select(`
      *,
      profiles:author_id (name, avatar_url)
    `)
    .eq('id', blogId)
    .single()

  if (error || !blog) {
    notFound()
  }

  const { data: comments } = await supabase
    .from('blog_comments')
    .select(`
      id,
      content,
      created_at,
      profiles:user_id (name, avatar_url)
    `)
    .eq('blog_id', blogId)
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()
  let hasLiked = false
  let hasSaved = false

  if (user) {
    const [{ data: likeData }, { data: saveData }] = await Promise.all([
      supabase.from('blog_likes').select('id').eq('blog_id', blogId).eq('user_id', user.id).single(),
      supabase.from('blog_saves').select('id').eq('blog_id', blogId).eq('user_id', user.id).single()
    ])
    hasLiked = !!likeData
    hasSaved = !!saveData
  }

  const { count: likesCount } = await supabase
    .from('blog_likes')
    .select('id', { count: 'exact' })
    .eq('blog_id', blogId)

  return (
    <article className="app-container" style={{ maxWidth: 'min(75%, 1000px)', padding: '4rem 1.5rem' }}>
      {/* Article Header */}
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="heading-xl" style={{ marginBottom: '1rem', lineHeight: 1.1 }}>
          {blog.title}
        </h1>
        <p className="paragraph-lg" style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: 1.65 }}>
          {blog.subtitle}
        </p>

        {/* Author Meta */}
        <div className="flex-row-gap paragraph-sm" style={{ flexWrap: 'wrap', gap: '0.625rem' }}>
          <Link href={`/author/${blog.author_id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}>
            <div className="avatar-circle" style={{ width: '1.375rem', height: '1.375rem' }}>
              {blog.profiles?.avatar_url ? (
                <img src={blog.profiles.avatar_url} alt="" />
              ) : (
                <User size={11} />
              )}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)' }}>{blog.profiles?.name || 'Anonymous'}</span>
          </Link>

          <span style={{ color: 'var(--text-muted)' }}>·</span>

          <span className="flex-center" style={{ gap: '0.25rem' }}>
            <Calendar size={13} />
            {new Date(blog.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })}
          </span>

          <span style={{ color: 'var(--text-muted)' }}>·</span>

          <span className="flex-center" style={{ gap: '0.25rem' }}>
            <Clock size={13} />
            {blog.read_time_minutes} min read
          </span>
        </div>
      </header>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.5rem' }}>
          {blog.tags.map((tag: string) => (
            <Link key={tag} href={`/blogs?tag=${tag}`}>
              <span className="badge" style={{ marginBottom: 0, cursor: 'pointer' }}>{tag}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="divider" style={{ margin: '0 0 2.5rem 0' }} />

      {/* Blog Content — rendered as Markdown */}
      <BlogContent content={blog.content} />

      {/* Actions (Like, Save, Comment) */}
      <BlogActions
        blogId={blog.id}
        initialLiked={hasLiked}
        initialSaved={hasSaved}
        likesCount={likesCount || 0}
        isLoggedIn={!!user}
      />

      {/* Comments */}
      {comments && comments.length > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {comments.map((comment: any) => (
            <div key={comment.id} style={{
              padding: '1rem 0',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div className="avatar-circle" style={{ width: '2rem', height: '2rem', marginTop: '2px' }}>
                  {comment.profiles?.avatar_url ? (
                    <img src={comment.profiles.avatar_url} alt="" />
                  ) : (
                    <User size={14} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{comment.profiles?.name || 'Anonymous'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.55, color: 'var(--foreground)', marginTop: '0.25rem' }}>{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
