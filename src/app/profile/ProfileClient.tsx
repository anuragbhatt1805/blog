'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { logout } from '@/app/(auth)/actions'
import { User, LogOut, Upload, Key, Settings, Trash2, Bookmark } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

export default function ProfileClient({ profile, email, isAdmin }: { profile: any, email: string, isAdmin: boolean }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { info: showInfo, error: showError } = useToast()

  const supabase = createClient()

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const bio = formData.get('bio') as string
    const website = formData.get('website') as string
    const twitter = formData.get('twitter') as string
    const github = formData.get('github') as string
    const linkedin = formData.get('linkedin') as string
    const avatar = formData.get('avatar') as File

    let avatarUrl = profile?.avatar_url

    try {
      if (avatar && avatar.size > 0) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(avatar.type)) {
          showError('Please upload a JPG, PNG, WebP, or GIF image. HEIC is not supported.')
          setIsUpdating(false)
          return
        }

        const fileExt = avatar.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `${profile?.id}/${fileName}`

        // Delete old avatar if it exists
        if (avatarUrl && avatarUrl.includes('/avatars/')) {
          const oldPath = avatarUrl.split('/avatars/').pop()
          if (oldPath) {
            await supabase.storage.from('avatars').remove([decodeURIComponent(oldPath)])
          }
        }

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatar, { contentType: avatar.type })

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)

        avatarUrl = data.publicUrl
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name,
          bio: bio || null,
          website: website || null,
          twitter: twitter || null,
          github: github || null,
          linkedin: linkedin || null,
          avatar_url: avatarUrl,
        })
        .eq('id', profile?.id)

      if (updateError) throw updateError

      setIsUpdating(false)
      showInfo('Profile updated successfully!')
      setTimeout(() => window.location.reload(), 1000)
    } catch (err: any) {
      showError(err.message || 'Error updating profile')
      setIsUpdating(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure? This action cannot be undone and will delete all your data.')) {
      return
    }

    try {
      const { error } = await supabase.rpc('delete_user')
      if (error) throw error
      await logout()
    } catch (err: any) {
      showError(err.message || 'Failed to delete account. Please try again.')
    }
  }

  return (
    <div className="app-container" style={{ maxWidth: '1000px', padding: '4rem 1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>

        {/* Sidebar */}
        <div className="saas-card-static" style={{ height: 'fit-content' }}>
          <div className="flex-center" style={{ flexDirection: 'column', textAlign: 'center', marginBottom: '2rem' }}>
            <div className="avatar-circle" style={{ width: '6rem', height: '6rem', marginBottom: '1rem', border: '2px solid var(--primary)' }}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" />
              ) : (
                <User size={48} className="text-muted" />
              )}
            </div>
            <h2 className="heading-md">{profile?.name || 'User'}</h2>
            <p className="paragraph-sm text-muted">{email}</p>
            {isAdmin && (
              <div className="badge" style={{ marginTop: '0.75rem' }}>Admin</div>
            )}
          </div>

          <div className="divider" style={{ margin: '1.5rem 0' }}></div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {isAdmin && (
              <a href="/admin/blogs" className="btn btn-primary btn-full flex-center" style={{ justifyContent: 'flex-start', marginBottom: '0.5rem' }}>
                <Settings size={18} /> Admin Dashboard
              </a>
            )}
            {isAdmin && (
              <a href="/settings" className="btn btn-outline btn-full flex-center" style={{ justifyContent: 'flex-start', color: 'var(--primary)', borderColor: 'var(--primary)', backgroundColor: 'rgba(20, 184, 166, 0.05)' }}>
                <Settings size={18} /> General Settings
              </a>
            )}
            <form action={logout}>
              <button type="submit" className="btn btn-outline btn-full flex-center" style={{ justifyContent: 'flex-start' }}>
                <LogOut size={18} /> Log out
              </button>
            </form>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Settings Card */}
          <div className="saas-card-static">
            <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>Profile Settings</h3>

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Display Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  defaultValue={profile?.name || ''}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  defaultValue={email}
                  disabled
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
                <p className="paragraph-sm" style={{ marginTop: '0.5rem' }}>Email cannot be changed directly.</p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="avatar">Profile Picture</label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept=".jpg,.jpeg,.png,.webp,.gif"
                  className="form-input"
                  style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                />
              </div>

              <div className="divider" />
              <h4 className="heading-sm" style={{ marginBottom: '0.25rem' }}>About & Social</h4>
              <p className="paragraph-sm" style={{ marginBottom: '1rem' }}>Visible on your public author profile.</p>

              <div className="form-group">
                <label className="form-label" htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  className="form-input"
                  defaultValue={profile?.bio || ''}
                  placeholder="A short bio about yourself..."
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="website">Website</label>
                  <input type="url" id="website" name="website" className="form-input" defaultValue={profile?.website || ''} placeholder="https://yoursite.com" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="twitter">Twitter / X</label>
                  <input type="text" id="twitter" name="twitter" className="form-input" defaultValue={profile?.twitter || ''} placeholder="https://x.com/handle" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="github">GitHub</label>
                  <input type="text" id="github" name="github" className="form-input" defaultValue={profile?.github || ''} placeholder="https://github.com/username" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="linkedin">LinkedIn</label>
                  <input type="text" id="linkedin" name="linkedin" className="form-input" defaultValue={profile?.linkedin || ''} placeholder="https://linkedin.com/in/name" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="saas-card-static" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h3 className="heading-md" style={{ color: '#ef4444', marginBottom: '1rem' }}>Danger Zone</h3>
            <p className="paragraph-md text-muted" style={{ marginBottom: '1.5rem' }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="btn btn-outline"
              style={{ color: '#ef4444', borderColor: '#ef4444' }}
            >
              <Trash2 size={18} /> Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
