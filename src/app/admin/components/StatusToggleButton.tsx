'use client'

import { useTransition } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { toggleBlogStatus } from '../actions'
import { useToast } from '@/components/ToastProvider'

interface StatusToggleButtonProps {
  id: string
  title: string
  status: string
}

export default function StatusToggleButton({ id, title, status }: StatusToggleButtonProps) {
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  const handleToggle = () => {
    const newStatus = status === 'published' ? 'draft' : 'published'
    startTransition(async () => {
      try {
        await toggleBlogStatus(id, newStatus)
        if (newStatus === 'published') {
          toast.success(`"${title}" is now published`)
        } else {
          toast.success(`"${title}" reverted to draft`)
        }
      } catch (error) {
        toast.error('Failed to update status')
      }
    })
  }

  return (
    <button 
      type="button" 
      className={`btn-icon ${isPending ? 'opacity-50' : ''}`}
      style={{ color: 'var(--text-muted)' }}
      title={status === 'published' ? "Revert to Draft" : "Publish"}
      onClick={handleToggle}
      disabled={isPending}
    >
      {status === 'published' ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  )
}
