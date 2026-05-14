'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteBlog } from '../actions'
import Modal from '@/components/Modal'
import { useToast } from '@/components/ToastProvider'

interface DeleteBlogButtonProps {
  id: string
  title: string
}

export default function DeleteBlogButton({ id, title }: DeleteBlogButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteBlog(id)
        toast.success('Blog deleted successfully')
        setIsModalOpen(false)
      } catch (error: any) {
        console.error('Delete action failed:', error)
        toast.error('Failed to delete blog')
      }
    })
  }

  return (
    <>
      <button 
        type="button" 
        className="btn-icon" 
        style={{ color: '#ef4444' }} 
        title="Delete" 
        onClick={() => setIsModalOpen(true)}
      >
        <Trash2 size={18} />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete Blog"
        footer={
          <>
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete Blog'}
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone and all associated images will be permanently removed from Cloudinary.</p>
      </Modal>
    </>
  )
}
