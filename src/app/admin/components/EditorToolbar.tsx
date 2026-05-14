'use client'

import { type Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline, Strikethrough, Code, Quote, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3,
  Image, Link, Undo2, Redo2, Minus, CodeSquare, Check, X
} from 'lucide-react'
import { useToast } from '@/components/ToastProvider'
import { useRef, useState } from 'react'

function ToolbarButton({ 
  onClick, active, title, children, disabled 
}: { 
  onClick: () => void, active?: boolean, title: string, children: React.ReactNode, disabled?: boolean 
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2rem',
        height: '2rem',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: active ? 'var(--primary)' : 'transparent',
        color: active ? 'var(--text-inverse)' : 'var(--foreground)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!active && !disabled) (e.target as HTMLElement).style.background = 'var(--surface-2)' }}
      onMouseLeave={e => { if (!active) (e.target as HTMLElement).style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div style={{ width: '1px', height: '1.5rem', background: 'var(--border)', margin: '0 0.25rem' }} />
}

export default function EditorToolbar({ editor, isDraft = true }: { editor: Editor | null, isDraft?: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const linkBtnRef = useRef<HTMLDivElement>(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const { error: showError } = useToast()

  if (!editor) return null

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      showError('Only JPG, PNG, WebP, or GIF images are supported.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('isDraft', String(isDraft))

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Upload failed')
      }

      const { url } = await res.json()
      editor.chain().focus().setImage({ src: url }).run()
    } catch (err: any) {
      showError(err.message || 'Failed to upload image')
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const openLinkInput = () => {
    const existingHref = editor.getAttributes('link').href || ''
    setLinkUrl(existingHref)
    setShowLinkInput(true)
  }

  const applyLink = () => {
    let url = linkUrl.trim()
    if (url && !/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
    setShowLinkInput(false)
    setLinkUrl('')
  }

  const removeLink = () => {
    editor.chain().focus().unsetLink().run()
    setShowLinkInput(false)
    setLinkUrl('')
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.125rem',
      padding: '0.5rem 0.75rem',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface-1)',
      alignItems: 'center',
    }}>
      {/* Undo / Redo */}
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo" disabled={!editor.can().undo()}>
        <Undo2 size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo" disabled={!editor.can().redo()}>
        <Redo2 size={15} />
      </ToolbarButton>

      <Divider />

      {/* Headings */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
        <Heading1 size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
        <Heading2 size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
        <Heading3 size={15} />
      </ToolbarButton>

      <Divider />

      {/* Inline formatting */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
        <Underline size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
        <Code size={15} />
      </ToolbarButton>

      <Divider />

      {/* Alignment */}
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
        <AlignLeft size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">
        <AlignCenter size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
        <AlignRight size={15} />
      </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
        <ListOrdered size={15} />
      </ToolbarButton>

      <Divider />

      {/* Block elements */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
        <Quote size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
        <CodeSquare size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
        <Minus size={15} />
      </ToolbarButton>

      <Divider />

      {/* Link & Image */}
      <div ref={linkBtnRef} style={{ position: 'relative', display: 'inline-flex' }}>
        <ToolbarButton
          onClick={() => { editor.isActive('link') ? removeLink() : openLinkInput() }}
          active={editor.isActive('link')}
          title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}
        >
          <Link size={15} />
        </ToolbarButton>

        {/* Inline Link Popover */}
        {showLinkInput && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.5rem',
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.5rem',
            display: 'flex',
            gap: '0.375rem',
            alignItems: 'center',
            zIndex: 50,
            boxShadow: 'var(--shadow-lg)',
            minWidth: '300px',
          }}>
            <input
              autoFocus
              type="url"
              className="form-input"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyLink(); } if (e.key === 'Escape') setShowLinkInput(false) }}
              placeholder="https://example.com"
              style={{ flex: 1, fontSize: '0.8125rem', padding: '0.375rem 0.625rem' }}
            />
            <button type="button" onClick={applyLink} title="Apply" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '1.75rem', height: '1.75rem', borderRadius: 'var(--radius-md)',
              border: 'none', background: 'var(--primary)', color: 'var(--text-inverse)', cursor: 'pointer'
            }}>
              <Check size={14} />
            </button>
            <button type="button" onClick={() => setShowLinkInput(false)} title="Cancel" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '1.75rem', height: '1.75rem', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', background: 'transparent', color: 'var(--foreground)', cursor: 'pointer'
            }}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>
      <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Upload Image">
        <Image size={15} />
      </ToolbarButton>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </div>
  )
}
