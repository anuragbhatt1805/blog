'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const name = formData.get('name') as string
  if (name) {
    await supabase.from('profiles').update({ name }).eq('id', user.id)
  }
  revalidatePath('/profile')
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  if (password) {
    await supabase.auth.updateUser({ password })
  }
  revalidatePath('/profile')
}

export async function deleteAccount() {
  const supabase = await createClient()
  await supabase.rpc('delete_user')
  await supabase.auth.signOut()
  redirect('/')
}
