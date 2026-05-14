'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(blogId: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  if (currentStatus) {
    await supabase.from('blog_likes').delete().eq('blog_id', blogId).eq('user_id', user.id)
  } else {
    await supabase.from('blog_likes').insert({ blog_id: blogId, user_id: user.id })
  }
  revalidatePath(`/blogs/${blogId}`)
}

export async function toggleSave(blogId: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  if (currentStatus) {
    await supabase.from('blog_saves').delete().eq('blog_id', blogId).eq('user_id', user.id)
  } else {
    await supabase.from('blog_saves').insert({ blog_id: blogId, user_id: user.id })
  }
  revalidatePath(`/blogs/${blogId}`)
  revalidatePath('/profile')
}

export async function addComment(blogId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  await supabase.from('blog_comments').insert({
    blog_id: blogId,
    user_id: user.id,
    content
  })
  revalidatePath(`/blogs/${blogId}`)
}
