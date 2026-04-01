import { useRef, useEffect, useState } from 'react'
import { Send, Square, CornerDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatInput({ 
  onSendMessage, 
  isLoading, 
  onStop,
  disabled 
}) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [message])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message)
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-2 p-4 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Input Container */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje..."
            disabled={disabled || isLoading}
            rows={1}
            className={cn(
              "w-full min-h-[48px] max-h-[200px] px-4 py-3 pr-12",
              "rounded-xl border border-input bg-secondary",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "resize-none transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            style={{ fieldSizing: 'content' }}
          />
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!message.trim() || isLoading || disabled}
            className={cn(
              "absolute right-2 bottom-2",
              "w-8 h-8 rounded-lg",
              "flex items-center justify-center",
              "transition-all duration-200",
              message.trim() && !isLoading && !disabled
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isLoading ? (
              <Square className="w-4 h-4" onClick={onStop} />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Hint */}
      <div className="flex items-center justify-center gap-4 pb-2 px-4">
        <p className="text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Enter</kbd> para enviar
        </p>
        <p className="text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Enter</kbd> para nueva línea
        </p>
      </div>
    </form>
  )
}
