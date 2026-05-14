'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function BlogContent({ content }: { content: string }) {
  // Detect if content is HTML (from Tiptap) or Markdown (legacy)
  const isHTML = content.trimStart().startsWith('<')

  if (isHTML) {
    return (
      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // Legacy Markdown content
  return (
    <div className="markdown-preview">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
