import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit2, Eye, EyeOff } from 'lucide-react'
import { toggleBlogStatus, deleteBlog } from '../actions'
import DeleteBlogButton from '../components/DeleteBlogButton'
import StatusToggleButton from '../components/StatusToggleButton'

export default async function AdminBlogsPage() {
  const supabase = await createClient()

  // Admins can see all blogs due to the RLS policy we set up
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="saas-card" style={{ padding: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 className="heading-md">Manage Blogs</h1>
        <Link href="/admin/blogs/new" className="btn btn-primary">
          <Plus size={18} /> Write New Blog
        </Link>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs?.length ? blogs.map(blog => (
              <tr key={blog.id} style={{ borderBottom: '1px solid var(--surface-3)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>
                  <Link href={`/blogs/${blog.id}`} className="hover:text-primary transition-colors" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {blog.thumbnail_url ? (
                      <img src={blog.thumbnail_url} alt="" style={{ width: '40px', height: '24px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '24px', backgroundColor: 'var(--surface-3)', borderRadius: '4px' }} />
                    )}
                    {blog.title}
                  </Link>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge" style={{ 
                    marginBottom: 0, 
                    backgroundColor: blog.status === 'published' ? 'rgba(20, 184, 166, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: blog.status === 'published' ? 'var(--primary)' : '#f59e0b',
                    borderColor: blog.status === 'published' ? 'rgba(20, 184, 166, 0.2)' : 'rgba(245, 158, 11, 0.2)'
                  }}>
                    {blog.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {new Date(blog.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div className="flex-center" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <StatusToggleButton id={blog.id} title={blog.title} status={blog.status} />
                    <Link href={`/admin/blogs/${blog.id}/edit`} className="btn-icon text-muted" style={{ color: 'var(--secondary)' }} title="Edit">
                      <Edit2 size={18} />
                    </Link>
                    <DeleteBlogButton id={blog.id} title={blog.title} />
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No blogs found. Start writing!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
