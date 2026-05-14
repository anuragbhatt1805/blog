'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Forbidden')
  
  return { supabase, user }
}

function calculateReadTime(content: string) {
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 200)) // 200 WPM
}

export async function createBlog(formData: FormData) {
  const { supabase, user } = await checkAdmin()

  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const content = formData.get('content') as string
  const status = formData.get('status') as string || 'draft'
  
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? JSON.parse(tagsRaw) : []
  
  const read_time_minutes = calculateReadTime(content)

  const { error } = await supabase.from('blogs').insert({
    author_id: user.id,
    title,
    subtitle,
    content,
    read_time_minutes,
    status,
    tags
  })

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/blogs')
  revalidatePath('/admin/blogs')
  redirect('/admin/blogs')
}

export async function updateBlog(id: string, formData: FormData) {
  const { supabase } = await checkAdmin()

  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const content = formData.get('content') as string
  const status = formData.get('status') as string || 'draft'
  
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? JSON.parse(tagsRaw) : []
  
  const read_time_minutes = calculateReadTime(content)

  const { error } = await supabase.from('blogs')
    .update({
      title,
      subtitle,
      content,
      read_time_minutes,
      status,
      tags,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/blogs')
  revalidatePath(`/blogs/${id}`)
  revalidatePath('/admin/blogs')
  redirect('/admin/blogs')
}

export async function toggleBlogStatus(id: string, newStatus: string) {
  const { supabase } = await checkAdmin()

  const { error } = await supabase.from('blogs')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/blogs')
  revalidatePath(`/blogs/${id}`)
  revalidatePath('/admin/blogs')
}

export async function deleteBlog(id: string) {
  const { supabase } = await checkAdmin()

  const { error } = await supabase.from('blogs').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/blogs')
  revalidatePath('/admin/blogs')
}
