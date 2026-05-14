'use client'

import { Trash2 } from 'lucide-react'

export default function DeleteBlogButton() {
  return (
    <button 
      type="submit" 
      className="btn-icon" 
      style={{ color: '#ef4444' }} 
      title="Delete" 
      onClick={(e) => {
        if (!confirm('Are you sure you want to delete this blog?')) {
          e.preventDefault()
        }
      }}
    >
      <Trash2 size={18} />
    </button>
  )
}
