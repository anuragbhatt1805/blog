import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BlogActions from './BlogActions'
import BlogContent from './BlogContent'
import { Clock, User, Calendar } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const blogSlug = resolvedParams.slug;
  const supabase = await createClient()

  const decodedSlug = decodeURIComponent(blogSlug);
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedSlug);

  let query = supabase.from('blogs').select('title, subtitle, thumbnail_url, tags');
  if (isUuid) {
    query = query.eq('id', decodedSlug);
  } else {
    query = query.eq('slug', decodedSlug);
  }

  const { data: blog } = await query.single()

  if (!blog) {
    return {
      title: 'Blog Not Found',
    }
  }

  return {
    title: blog.title,
    description: blog.subtitle,
    keywords: blog.tags || [],
    openGraph: {
      title: blog.title,
      description: blog.subtitle,
      type: 'article',
      images: blog.thumbnail_url ? [{ url: blog.thumbnail_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.subtitle,
      images: blog.thumbnail_url ? [blog.thumbnail_url] : [],
    },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blogSlug = resolvedParams.slug;
  const supabase = await createClient()

  const decodedSlug = decodeURIComponent(blogSlug);
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedSlug);

  let query = supabase
    .from('blogs')
    .select(`
      *,
      profiles:author_id (name, avatar_url)
    `);

  if (isUuid) {
    query = query.eq('id', decodedSlug);
  } else {
    query = query.eq('slug', decodedSlug);
  }

  const { data: blog, error } = await query.single()

  if (error || !blog) {
    notFound()
  }

  const blogId = blog.id;

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
    <article className="app-container" style={{ maxWidth: '780px', padding: '4rem 1.5rem' }}>
      {/* Article Header */}
      <header style={{ marginBottom: '3rem' }}>
        {/* Eyebrow meta */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--text-muted)',
          marginBottom: '1.75rem',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <Calendar size={11} />
            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <Clock size={11} />
            {blog.read_time_minutes} min read
          </span>
          {blog.tags && blog.tags.length > 0 && (
            <>
              <span>·</span>
              <span>{blog.tags.slice(0, 3).join(' / ')}</span>
            </>
          )}
        </div>

        <h1 className="heading-xl" style={{ marginBottom: '1.25rem', lineHeight: 1 }}>
          {blog.title}
        </h1>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.375rem',
          lineHeight: 1.4,
          color: 'var(--text-muted)',
          marginBottom: '2rem',
          fontStyle: 'italic',
        }}>
          {blog.subtitle}
        </p>

        {/* Author byline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border)',
        }}>
          <Link href={`/author/${blog.author_id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
            <div className="avatar-circle" style={{ width: '2rem', height: '2rem' }}>
              {blog.profiles?.avatar_url ? (
                <img src={blog.profiles.avatar_url} alt="" />
              ) : (
                <User size={13} />
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--text-muted)',
              }}>
                Written by
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', color: 'var(--foreground)' }}>
                {blog.profiles?.name || 'Anonymous'}
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Thumbnail */}
      {blog.thumbnail_url && (
        <div style={{ marginBottom: '3rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '16/9' }}>
          <img src={blog.thumbnail_url} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '2rem' }}>
          {blog.tags.map((tag: string) => (
            <Link key={tag} href={`/blogs?tag=${tag}`}>
              <span className="badge" style={{ cursor: 'pointer' }}>{tag}</span>
            </Link>
          ))}
        </div>
      )}

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
