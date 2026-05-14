'use client'

import { useState, useEffect } from 'react'
import { type Editor } from '@tiptap/react'
import { ExternalLink, Pencil, Unlink, Check, X } from 'lucide-react'

export default function LinkBubble({ editor }: { editor: Editor }) {
  const [isEditing, setIsEditing] = useState(false)
  const [url, setUrl] = useState('')
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    const updatePosition = () => {
      if (!editor.isActive('link')) {
        setPosition(null)
        setIsEditing(false)
        return
      }

      const { view } = editor
      const { from } = view.state.selection
      const coords = view.coordsAtPos(from)
      const editorRect = view.dom.closest('[style*="overflow"]')?.getBoundingClientRect()

      if (editorRect) {
        setPosition({
          top: coords.bottom - editorRect.top + 8,
          left: coords.left - editorRect.left,
        })
      }
    }

    editor.on('selectionUpdate', updatePosition)
    editor.on('transaction', updatePosition)

    return () => {
      editor.off('selectionUpdate', updatePosition)
      editor.off('transaction', updatePosition)
    }
  }, [editor])

  if (!position || !editor.isActive('link')) return null

  const currentHref = editor.getAttributes('link').href || ''

  const startEdit = () => {
    setUrl(currentHref)
    setIsEditing(true)
  }

  const applyEdit = () => {
    let finalUrl = url.trim()
    if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl
    }
    if (finalUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run()
    }
    setIsEditing(false)
  }

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setIsEditing(false)
  }

  return (
    <div style={{
      position: 'absolute',
      top: position.top,
      left: Math.max(0, position.left),
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '0.375rem 0.5rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      fontSize: '0.8125rem',
      animation: 'fadeIn 0.15s ease',
    }}>
      {isEditing ? (
        <>
          <input
            autoFocus
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); applyEdit() }
              if (e.key === 'Escape') setIsEditing(false)
            }}
            placeholder="https://example.com"
            className="form-input"
            style={{ width: '220px', fontSize: '0.8125rem', padding: '0.25rem 0.5rem' }}
          />
          <button type="button" onClick={applyEdit} title="Apply" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '1.5rem', height: '1.5rem', borderRadius: 'var(--radius-sm)',
            border: 'none', background: 'var(--primary)', color: 'var(--text-inverse)', cursor: 'pointer'
          }}>
            <Check size={12} />
          </button>
          <button type="button" onClick={() => setIsEditing(false)} title="Cancel" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '1.5rem', height: '1.5rem', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)', background: 'transparent', color: 'var(--foreground)', cursor: 'pointer'
          }}>
            <X size={12} />
          </button>
        </>
      ) : (
        <>
          <a
            href={currentHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--primary)',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textDecoration: 'underline',
            }}
            title={currentHref}
          >
            {currentHref}
          </a>
          <button type="button" onClick={() => window.open(currentHref, '_blank')} title="Open link" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '1.5rem', height: '1.5rem', borderRadius: 'var(--radius-sm)',
            border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer'
          }}>
            <ExternalLink size={13} />
          </button>
          <button type="button" onClick={startEdit} title="Edit link" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '1.5rem', height: '1.5rem', borderRadius: 'var(--radius-sm)',
            border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer'
          }}>
            <Pencil size={13} />
          </button>
          <button type="button" onClick={removeLink} title="Remove link" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '1.5rem', height: '1.5rem', borderRadius: 'var(--radius-sm)',
            border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer'
          }}>
            <Unlink size={13} />
          </button>
        </>
      )}
    </div>
  )
}
