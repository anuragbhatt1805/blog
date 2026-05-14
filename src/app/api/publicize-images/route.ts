import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { publicIds } = await request.json()
    
    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json({ ok: true })
    }

    // Change each image from authenticated to public
    const results = await Promise.allSettled(
      publicIds.map((pid: string) =>
        cloudinary.uploader.rename(pid, pid, { 
          type: 'authenticated',
          to_type: 'upload',
          overwrite: true,
        })
      )
    )

    return NextResponse.json({ ok: true, results: results.length })
  } catch (err: any) {
    console.error('Cloudinary publicize error:', err)
    return NextResponse.json({ error: err.message || 'Failed to publicize images' }, { status: 500 })
  }
}
