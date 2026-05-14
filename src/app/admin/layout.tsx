import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText, LayoutDashboard, Settings } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
      <aside className="saas-card" style={{ height: 'fit-content' }}>
        <h2 className="heading-md" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          Admin Panel
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin/blogs" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', background: 'var(--surface-2)' }}>
            <FileText size={18} /> Manage Blogs
          </Link>
          <button className="btn btn-outline" disabled style={{ justifyContent: 'flex-start', border: 'none', opacity: 0.5, cursor: 'not-allowed' }}>
            <LayoutDashboard size={18} /> Analytics (Soon)
          </button>
          <button className="btn btn-outline" disabled style={{ justifyContent: 'flex-start', border: 'none', opacity: 0.5, cursor: 'not-allowed' }}>
            <Settings size={18} /> Site Settings
          </button>
        </nav>
      </aside>
      
      <div style={{ minHeight: '60vh' }}>
        {children}
      </div>
    </div>
  )
}
