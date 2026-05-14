'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ToastProvider'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function SettingsClient({ settings }: { settings: Record<string, string> }) {
  const [values, setValues] = useState(settings)
  const [isSaving, setIsSaving] = useState(false)
  const { info: showInfo, error: showError } = useToast()
  const supabase = createClient()

  const update = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const entries = Object.entries(values)
      for (const [key, value] of entries) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        if (error) throw error
      }
      showInfo('Settings saved successfully!')
    } catch (err: any) {
      showError(err.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="app-container" style={{ maxWidth: '800px', padding: '4rem 1.5rem' }}>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
        <div>
          <Link href="/profile" className="flex-center paragraph-sm" style={{ gap: '0.25rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
            <ArrowLeft size={14} /> Back to profile
          </Link>
          <h1 className="heading-lg" style={{ marginBottom: '0.25rem' }}>General Settings</h1>
          <p className="paragraph-md">Configure your site&apos;s public content and links.</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
          <Save size={16} /> {isSaving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {/* About Author Section */}
      <div className="saas-card-static" style={{ marginBottom: '1.5rem' }}>
        <h3 className="heading-sm" style={{ marginBottom: '0.25rem' }}>About the Author</h3>
        <p className="paragraph-sm" style={{ marginBottom: '1.5rem' }}>This content appears on the landing page.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="author_name">Author Name</label>
            <input
              id="author_name"
              className="form-input"
              value={values.author_name || ''}
              onChange={e => update('author_name', e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="author_avatar_letter">Avatar Letter</label>
            <input
              id="author_avatar_letter"
              className="form-input"
              value={values.author_avatar_letter || ''}
              onChange={e => update('author_avatar_letter', e.target.value)}
              placeholder="A"
              maxLength={2}
              style={{ maxWidth: '80px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="author_bio">Bio</label>
            <textarea
              id="author_bio"
              className="form-input"
              value={values.author_bio || ''}
              onChange={e => update('author_bio', e.target.value)}
              placeholder="A brief introduction about you..."
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </div>

      {/* Social & Contact Links */}
      <div className="saas-card-static" style={{ marginBottom: '1.5rem' }}>
        <h3 className="heading-sm" style={{ marginBottom: '0.25rem' }}>Social & Contact Links</h3>
        <p className="paragraph-sm" style={{ marginBottom: '1.5rem' }}>Shown in the footer and author section.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="github_url">GitHub</label>
            <input
              id="github_url"
              className="form-input"
              value={values.github_url || ''}
              onChange={e => update('github_url', e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="twitter_url">Twitter / X</label>
            <input
              id="twitter_url"
              className="form-input"
              value={values.twitter_url || ''}
              onChange={e => update('twitter_url', e.target.value)}
              placeholder="https://x.com/handle"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="linkedin_url">LinkedIn</label>
            <input
              id="linkedin_url"
              className="form-input"
              value={values.linkedin_url || ''}
              onChange={e => update('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/name"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="contact_url">Contact Page</label>
            <input
              id="contact_url"
              className="form-input"
              value={values.contact_url || ''}
              onChange={e => update('contact_url', e.target.value)}
              placeholder="https://yoursite.com/contact"
            />
          </div>
        </div>
      </div>

      {/* Policies (placeholder for future) */}
      <div className="saas-card-static" style={{ opacity: 0.6 }}>
        <h3 className="heading-sm" style={{ marginBottom: '0.25rem' }}>Policies</h3>
        <p className="paragraph-sm">Terms & Conditions and Privacy Policy — coming soon.</p>
      </div>
    </div>
  )
}
