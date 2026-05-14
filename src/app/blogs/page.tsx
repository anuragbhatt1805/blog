import { createClient } from '@/lib/supabase/server'
import BlogsClient from './BlogsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Blogs',
  description: 'Explore our latest articles, tutorials, and insights for modern developers.',
}

export const revalidate = 60 // Revalidate every minute

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data: blogs } = await supabase
    .from('blogs')
    .select(`
      id, 
      slug,
      title, 
      subtitle, 
      read_time_minutes, 
      created_at,
      tags,
      thumbnail_url,
      profiles:author_id (name, avatar_url)
    `)
    .order('created_at', { ascending: false })

  return <BlogsClient initialBlogs={blogs || []} />
}
