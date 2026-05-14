'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Save, Send, X } from 'lucide-react'
import { createBlog, updateBlog } from '../actions'
import { useToast } from '@/components/ToastProvider'

export default function BlogEditor({ 
  initialData = { title: '', subtitle: '', content: '', status: 'draft', id: '', tags: [] as string[] }
}: { 
  initialData?: { id?: string, title: string, subtitle: string, content: string, status: string, tags?: string[] } 
}) {
  const [title, setTitle] = useState(initialData.title)
  const [subtitle, setSubtitle] = useState(initialData.subtitle)
  const [content, setContent] = useState(initialData.content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState<string[]>(initialData.tags || [])
  const [tagInput, setTagInput] = useState('')
  const { error: showError } = useToast()

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) {
      setTags([...tags, t])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const isEdit = !!initialData.id

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const submitter = (e.nativeEvent as any).submitter as HTMLButtonElement | null;
    const status = submitter?.value || 'draft';

    const formData = new FormData(e.currentTarget)
    formData.set('content', content)
    formData.set('status', status)
    formData.set('tags', JSON.stringify(tags))

    try {
      if (isEdit) {
        await updateBlog(initialData.id!, formData)
      } else {
        await createBlog(formData)
      }
    } catch (err) {
      console.error(err)
      showError('Error saving blog. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="saas-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Editor Header */}
      <div className="flex-between" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h1 className="heading-md" style={{ marginBottom: 0 }}>
          {isEdit ? 'Edit Blog' : 'Write New Blog'}
        </h1>
        <div className="flex-center" style={{ gap: '1rem' }}>
          <button type="submit" name="status" value="draft" className="btn btn-outline" disabled={isSubmitting}>
            <Save size={18} /> Save as Draft
          </button>
          <button type="submit" name="status" value="published" className="btn btn-primary" disabled={isSubmitting}>
            <Send size={18} /> Publish
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Pane: Editor */}
        <div style={{ padding: '1.5rem', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="title">Title</label>
            <input 
              id="title" name="title" className="form-input" 
              value={title} onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. How to scale a Next.js app" required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="subtitle">Subtitle</label>
            <input 
              id="subtitle" name="subtitle" className="form-input" 
              value={subtitle} onChange={e => setSubtitle(e.target.value)} 
              placeholder="A brief summary of your article..." 
            />
          </div>
          <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
            <label className="form-label" htmlFor="content">Markdown Content</label>
            <textarea 
              id="content" name="content" className="form-input" 
              value={content} onChange={e => setContent(e.target.value)} 
              placeholder="Write your content in Markdown..." 
              style={{ flex: 1, resize: 'none', fontFamily: 'monospace' }} required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Tags <span style={{ fontWeight: 400 }}>(optional)</span></label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="form-input"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="e.g. react, nextjs, tutorial"
                style={{ flex: 1 }}
              />
              <button type="button" onClick={addTag} className="btn btn-outline btn-sm">Add</button>
            </div>
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.625rem' }}>
                {tags.map(tag => (
                  <span key={tag} className="badge" style={{ marginBottom: 0, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'default' }}>
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} style={{ display: 'inline-flex', padding: '1px', cursor: 'pointer' }}><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Live Preview */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', background: 'var(--surface-1)' }}>
          <div style={{ marginBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live Preview
          </div>
          <article>
            <h1 className="heading-xl" style={{ marginBottom: '1rem', lineHeight: 1.1 }}>
              {title || 'Untitled Blog'}
            </h1>
            <h2 className="heading-md text-muted" style={{ marginBottom: '2rem', lineHeight: 1.6 }}>
              {subtitle || 'Subtitle will appear here...'}
            </h2>
            <div className="markdown-preview" style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--foreground)' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*Start writing to see the preview...*'}
              </ReactMarkdown>
            </div>
          </article>
        </div>

      </div>
    </form>
  )
}
