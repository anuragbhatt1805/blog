import { createClient } from '@/lib/supabase/server'
import BlogsClient from './BlogsClient'

export const revalidate = 60 // Revalidate every minute

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data: blogs } = await supabase
    .from('blogs')
    .select(`
      id, 
      title, 
      subtitle, 
      read_time_minutes, 
      created_at,
      tags,
      profiles:author_id (name, avatar_url)
    `)
    .order('created_at', { ascending: false })

  return <BlogsClient initialBlogs={blogs || []} />
}
