'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import cloudinary from '@/lib/cloudinary'

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

function extractCloudinaryId(path: string): string {
  const segments = path.split('/')
  let startIndex = 0
  while (startIndex < segments.length) {
    const seg = segments[startIndex]
    // Transformation check: contains comma, equals, or matches common prefixes
    const isTransform = seg.includes(',') || seg.includes('=') || /^(c|w|h|q|f|g|fl|r|b|e|l|u|p|o|x|y|z|so|eo|du|dl|bo|co|cs|d|dn|dp|if|pg|sp|vc)_/.test(seg)
    const isVersion = /^v\d+$/.test(seg)
    
    if (isTransform || isVersion) {
      startIndex++
    } else {
      break
    }
  }
  // The rest is the public ID. Remove the extension if it's there.
  const remaining = segments.slice(startIndex).join('/')
  return remaining.replace(/\.[a-zA-Z0-9]+$/, '')
}

function extractCloudinaryImages(html: string): { id: string, type: string }[] {
  const images: { id: string, type: string }[] = []
  // Capture everything after the delivery type (upload/authenticated)
  const regex = /res\.cloudinary\.com\/[^/]+\/(?:image|video|raw)\/(upload|authenticated)\/([^" >]+)/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    if (match[1] && match[2]) {
      const publicId = extractCloudinaryId(match[2])
      if (publicId) {
        images.push({ type: match[1], id: publicId })
      }
    }
  }
  return images
}

function extractCloudinaryIdFromUrl(url: string | null): { id: string, type: string } | null {
  if (!url) return null
  const regex = /res\.cloudinary\.com\/[^/]+\/(?:image|video|raw)\/(upload|authenticated)\/([^?# ]+)/i
  const match = regex.exec(url)
  if (match && match[1] && match[2]) {
    const publicId = extractCloudinaryId(match[2])
    if (publicId) {
      return { type: match[1], id: publicId }
    }
  }
  return null
}

async function deleteCloudinaryImages(images: { id: string, type: string }[]) {
  if (!images.length) return
  await Promise.allSettled(
    images.map(img => cloudinary.uploader.destroy(img.id, { type: img.type, invalidate: true }))
  )
}

async function generateUniqueSlug(title: string, supabase: any): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  
  let slug = baseSlug;
  let isUnique = false;
  let counter = 0;

  while (!isUnique) {
    const { data } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!data) {
      isUnique = true;
    } else {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  }

  return slug;
}

export async function createBlog(formData: FormData) {
  const { supabase, user } = await checkAdmin()

  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const content = formData.get('content') as string
  const thumbnail_url = formData.get('thumbnail_url') as string
  const status = formData.get('status') as string || 'draft'
  
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? JSON.parse(tagsRaw) : []
  
  const read_time_minutes = calculateReadTime(content)
  
  const slug = await generateUniqueSlug(title, supabase)

  const { error } = await supabase.from('blogs').insert({
    author_id: user.id,
    title,
    subtitle,
    content,
    thumbnail_url,
    read_time_minutes,
    status,
    tags,
    slug
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
  const thumbnail_url = formData.get('thumbnail_url') as string
  const status = formData.get('status') as string || 'draft'
  
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? JSON.parse(tagsRaw) : []
  
  const read_time_minutes = calculateReadTime(content)

  // Fetch old content to compare images
  const { data: oldBlog } = await supabase.from('blogs').select('content, thumbnail_url').eq('id', id).single()

  if (oldBlog) {
    const oldImages = extractCloudinaryImages(oldBlog.content || '')
    const newImages = extractCloudinaryImages(content)
    const newImageIds = new Set(newImages.map(img => img.id))
    
    const imagesToDelete = oldImages.filter(img => !newImageIds.has(img.id))
    
    if (oldBlog.thumbnail_url && oldBlog.thumbnail_url !== thumbnail_url) {
      const oldThumb = extractCloudinaryIdFromUrl(oldBlog.thumbnail_url)
      if (oldThumb) imagesToDelete.push(oldThumb)
    }

    if (imagesToDelete.length > 0) {
      await deleteCloudinaryImages(imagesToDelete)
    }
  }

  const { error } = await supabase.from('blogs')
    .update({
      title,
      subtitle,
      content,
      thumbnail_url,
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

  try {
    // Fetch content first to delete associated images
    const { data: oldBlog, error: fetchError } = await supabase
      .from('blogs')
      .select('content, thumbnail_url')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('Error fetching blog for deletion:', fetchError)
      throw new Error(`Failed to fetch blog info: ${fetchError.message}`)
    }

    if (oldBlog) {
      const imagesToDelete = extractCloudinaryImages(oldBlog.content || '')
      
      const thumb = extractCloudinaryIdFromUrl(oldBlog.thumbnail_url)
      if (thumb) imagesToDelete.push(thumb)

      if (imagesToDelete.length > 0) {
        console.log('Deleting Cloudinary images:', imagesToDelete)
        await deleteCloudinaryImages(imagesToDelete)
      }
    }

    const { error: deleteError } = await supabase.from('blogs').delete().eq('id', id)
    if (deleteError) {
      console.error('Error deleting blog from DB:', deleteError)
      throw new Error(`DB Delete Error: ${deleteError.message}`)
    }

    revalidatePath('/')
    revalidatePath('/blogs')
    revalidatePath('/admin/blogs')
  } catch (error: any) {
    console.error('Fatal error in deleteBlog action:', error)
    throw error
  }
}
