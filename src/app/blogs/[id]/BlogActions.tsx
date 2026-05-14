'use client'

import { useState } from 'react'
import { Heart, BookmarkPlus, MessageCircle } from 'lucide-react'
import { toggleLike, toggleSave, addComment } from './actions'
import { useToast } from '@/components/ToastProvider'

export default function BlogActions({ 
  blogId, 
  initialLiked, 
  initialSaved,
  likesCount: initialLikesCount,
  isLoggedIn 
}: { 
  blogId: string
  initialLiked: boolean
  initialSaved: boolean
  likesCount: number
  isLoggedIn: boolean
}) {
  const [liked, setLiked] = useState(initialLiked)
  const [saved, setSaved] = useState(initialSaved)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { error: showError } = useToast()

  const handleLike = async () => {
    if (!isLoggedIn) return showError('Please sign in to like this article')
    const newLikedState = !liked
    setLiked(newLikedState)
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)
    await toggleLike(blogId, liked)
  }

  const handleSave = async () => {
    if (!isLoggedIn) return showError('Please sign in to save this article')
    setSaved(!saved)
    await toggleSave(blogId, saved)
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn) return showError('Please sign in to join the discussion')
    if (!comment.trim()) return
    
    setIsSubmitting(true)
    await addComment(blogId, comment)
    setComment('')
    setIsSubmitting(false)
  }

  return (
    <div style={{ marginTop: '4rem' }}>
      <div className="divider"></div>
      
      <div className="flex-between" style={{ padding: '1rem 0' }}>
        <button 
          onClick={handleLike}
          className="btn-icon flex-center"
          style={{ 
            color: liked ? 'var(--primary)' : 'var(--text-muted)',
            gap: '0.5rem',
            background: liked ? 'rgba(20, 184, 166, 0.1)' : 'transparent'
          }}
        >
          <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
          <span style={{ fontWeight: 600 }}>{likesCount}</span>
        </button>

        <button 
          onClick={handleSave}
          className="btn-icon"
          style={{ 
            color: saved ? 'var(--primary)' : 'var(--text-muted)',
            background: saved ? 'rgba(20, 184, 166, 0.1)' : 'transparent'
          }}
        >
          <BookmarkPlus size={24} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="divider"></div>

      <div style={{ marginTop: '3rem' }}>
        <h3 className="heading-md flex-row-gap" style={{ marginBottom: '1.5rem' }}>
          <MessageCircle /> Discussion
        </h3>
        
        <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={isLoggedIn ? "Share your thoughts..." : "Login to join the discussion"}
            disabled={!isLoggedIn || isSubmitting}
            className="form-input"
            rows={4}
            style={{ resize: 'vertical' }}
          />
          <div style={{ alignSelf: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={!isLoggedIn || isSubmitting || !comment.trim()}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
