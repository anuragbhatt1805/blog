import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BlogEditor from '../../../components/BlogEditor'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const blogId = resolvedParams.id;
  const supabase = await createClient()

  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', blogId)
    .single()

  if (error || !blog) {
    notFound()
  }

  return <BlogEditor initialData={blog} />
}
