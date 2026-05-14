'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageResize from 'tiptap-extension-resize-image'
import UnderlineExt from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import LinkExt from '@tiptap/extension-link'
import { Save, Send, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { createBlog, updateBlog } from '../actions'
import { useToast } from '@/components/ToastProvider'
import EditorToolbar from './EditorToolbar'
import LinkBubble from './LinkBubble'

export default function BlogEditor({ 
  initialData = { title: '', subtitle: '', content: '', status: 'draft', id: '', tags: [] as string[], thumbnail_url: '' }
}: { 
  initialData?: { id?: string, title: string, subtitle: string, content: string, status: string, tags?: string[], thumbnail_url?: string } 
}) {
  const [title, setTitle] = useState(initialData.title)
  const [subtitle, setSubtitle] = useState(initialData.subtitle)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState<string[]>(initialData.tags || [])
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnail_url || '')
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const toast = useToast()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      UnderlineExt,
      ImageResize.configure({
        allowBase64: true,
        HTMLAttributes: {
          style: 'border-radius: var(--radius-lg); margin: 0.5rem 0;',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          style: 'color: var(--primary); text-decoration: underline;',
        },
      }),
    ],
    content: initialData.content || '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  })

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
    const submitter = (e.nativeEvent as any).submitter as HTMLButtonElement | null
    const status = submitter?.value || 'draft'

    const content = editor?.getHTML() || ''

    const formData = new FormData(e.currentTarget)
    formData.set('content', content)
    formData.set('status', status)
    formData.set('tags', JSON.stringify(tags))
    formData.set('thumbnail_url', thumbnailUrl)

    try {
      if (status === 'published') {
        // Extract all Cloudinary public IDs from the content
        const cloudinaryIds: string[] = []
        if (editor) {
          const images = editor.getJSON().content?.flatMap(node => {
            const findImages = (n: any): any[] => {
              if (n.type === 'image') return [n]
              if (n.content) return n.content.flatMap(findImages)
              return []
            }
            return findImages(node)
          }) || []

          images.forEach(img => {
            const src = img.attrs?.src
            if (src && src.includes('res.cloudinary.com')) {
              // Extract public ID from URL: .../upload/v1234/folder/filename.ext
              const match = src.match(/\/v\d+\/(.+)\.[a-z]+$/i)
              if (match && match[1]) cloudinaryIds.push(match[1])
            }
          })
        }

        if (thumbnailUrl && thumbnailUrl.includes('res.cloudinary.com')) {
          const match = thumbnailUrl.match(/\/v\d+\/(.+)\.[a-z]+$/i)
          if (match && match[1]) cloudinaryIds.push(match[1])
        }

        if (cloudinaryIds.length > 0) {
          await fetch('/api/publicize-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicIds: cloudinaryIds })
          })
        }
      }

      if (isEdit) {
        await updateBlog(initialData.id!, formData)
        toast.success(`"${title}" updated successfully`)
      } else {
        await createBlog(formData)
        toast.success(`"${title}" created successfully`)
      }
    } catch (err) {
      console.error(err)
      toast.error('Error saving blog. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingThumb(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('isDraft', String(initialData.status === 'draft' || !isEdit))

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error(await res.text())

      const { url } = await res.json()
      setThumbnailUrl(url)
    } catch (err: any) {
      toast.error('Failed to upload thumbnail')
    } finally {
      setUploadingThumb(false)
      e.target.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="saas-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Editor Header */}
      <div className="flex-between" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
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

      {/* Meta Fields */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 300px' }}>
          <input 
            id="title" name="title" className="form-input" 
            value={title} onChange={e => setTitle(e.target.value)} 
            placeholder="Article title..." required 
            style={{ fontSize: '1.125rem', fontWeight: 600 }}
          />
        </div>
        <div style={{ flex: '2 1 300px' }}>
          <input 
            id="subtitle" name="subtitle" className="form-input" 
            value={subtitle} onChange={e => setSubtitle(e.target.value)} 
            placeholder="Subtitle (optional)..." 
          />
        </div>
        <div style={{ flex: '1 1 200px', display: 'flex', gap: '0.5rem' }}>
          <input
            className="form-input"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="Add tag..."
            style={{ flex: 1 }}
          />
          <button type="button" onClick={addTag} className="btn btn-outline btn-sm">Add</button>
        </div>
      </div>

      {/* Thumbnail Upload */}
      <div style={{ padding: '0.5rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', opacity: uploadingThumb ? 0.7 : 1 }}>
          {uploadingThumb ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
          {thumbnailUrl ? 'Change Thumbnail (16:9)' : 'Add Thumbnail (16:9)'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleThumbnailUpload} disabled={uploadingThumb} />
        </label>
        {thumbnailUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src={thumbnailUrl} alt="Thumbnail preview" style={{ height: '32px', width: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            <button type="button" onClick={() => setThumbnailUrl('')} className="btn btn-sm" style={{ color: '#ef4444', background: 'transparent' }}>Remove</button>
          </div>
        )}
      </div>

      {/* Tags Row */}
      {tags.length > 0 && (
        <div style={{ padding: '0.5rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {tags.map(tag => (
            <span key={tag} className="badge" style={{ marginBottom: 0, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'default' }}>
              {tag}
              <button type="button" onClick={() => removeTag(tag)} style={{ display: 'inline-flex', padding: '1px', cursor: 'pointer' }}><X size={12} /></button>
            </span>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <EditorToolbar editor={editor} isDraft={initialData.status === 'draft' || !isEdit} />

      {/* Editor Area */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {editor && <LinkBubble editor={editor} />}
        <EditorContent editor={editor} style={{ height: '100%' }} />
      </div>
    </form>
  )
}
