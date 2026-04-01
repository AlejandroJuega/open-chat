import { useRef, useEffect } from 'react'
import { User, Bot, Copy, Check, RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

export function ChatMessage({ message, onRegenerate, isLoading }) {
  const [copied, setCopied] = useState(false)
  const messagesEndRef = useRef(null)

  const isUser = message.role === 'user'
  const isError = message.isError

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message.content])

  return (
    <div className={cn(
      "group flex gap-4 p-4 md:p-6",
      isUser ? "bg-secondary/50" : "bg-background"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-gradient-to-br from-primary via-secondary to-accent text-white"
      )}>
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">
            {isUser ? 'Tú' : 'Asistente'}
          </span>
          {isError && (
            <span className="text-xs px-2 py-0.5 rounded bg-destructive/20 text-destructive">
              Error
            </span>
          )}
        </div>

        {/* Message Content */}
        <div className={cn(
          "prose prose-sm max-w-none",
          "dark:prose-invert",
          "prose-p:my-2 prose-li:my-1",
          "prose-headings:mt-4 prose-headings:mb-2",
          "prose-pre:p-0 prose-pre:bg-transparent prose-pre:p-0",
          "prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
        )}>
          {message.isTemporary ? (
            <span className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-100" />
              <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-200" />
            </span>
          ) : (
            <div className="whitespace-pre-wrap break-words">
              {message.content || (isLoading && !isUser ? (
                <span className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : null)}
              
              {/* Render as markdown-like */}
              <MessageContent content={message.content} />
            </div>
          )}
        </div>

        {/* Actions */}
        {!isUser && !message.isTemporary && (
          <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            {!isLoading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <div ref={messagesEndRef} />
    </div>
  )
}

// Simple markdown-like renderer
function MessageContent({ content }) {
  if (!content) return null

  // Split by code blocks
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g)
  
  return parts.map((part, index) => {
    // Code block
    if (part.startsWith('```')) {
      const code = part.slice(3, -3).replace(/^\w*\n/, '')
      return (
        <pre key={index} className="bg-muted rounded-lg p-4 overflow-x-auto my-2">
          <code>{code}</code>
        </pre>
      )
    }
    
    // Inline code
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="bg-muted px-1.5 py-0.5 rounded text-sm">{part.slice(1, -1)}</code>
    }
    
    // Regular text with basic formatting
    let formatted = part
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-3 mb-1">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n/g, '<br />')
    
    return <span key={index} dangerouslySetInnerHTML={{ __html: formatted }} />
  })
}
