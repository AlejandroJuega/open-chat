import { Bot } from 'lucide-react'
import { ChatMessage } from './ChatMessage'

export function ChatContainer({ 
  messages, 
  isLoading, 
  onRegenerate,
  selectedModel,
  onClearChat
}) {
  const hasMessages = messages.length > 0

  return (
    <div className="flex-1 overflow-y-auto">
      {!hasMessages ? (
        /* Welcome Screen */
        <div className="flex flex-col items-center justify-center h-full px-4 py-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-lg">
            <Bot className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            ¿En qué puedo ayudarte hoy?
          </h2>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Puedo responder preguntas, ayudarte con código, analizar documentos y mucho más.
          </p>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
            <QuickAction 
              icon="code"
              title="Ayuda con código"
              description="Escribe, revisa o explica código"
            />
            <QuickAction 
              icon="translate"
              title="Traducción"
              description="Traduce texto entre idiomas"
            />
            <QuickAction 
              icon="auto_awesome"
              title="Ideas creativas"
              description="Brainstorming y creatividad"
            />
            <QuickAction 
              icon="school"
              title="Explicaciones"
              description="Conceptos complejos simplificados"
            />
          </div>

          {/* Model Info */}
          {selectedModel && (
            <div className="mt-8 px-4 py-2 rounded-lg bg-muted text-sm text-muted-foreground">
              Modelo activo: <span className="font-medium text-foreground">{selectedModel.split('/').pop()}</span>
            </div>
          )}
        </div>
      ) : (
        /* Messages */
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id || index}
              message={message}
              isLoading={isLoading && index === messages.length - 1}
              onRegenerate={onRegenerate}
            />
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function QuickAction({ icon, title, description }) {
  return (
    <button 
      className="flex items-start gap-3 p-4 rounded-xl border border-border bg-secondary/50 hover:bg-accent transition-colors text-left"
      onClick={() => {
        // This could trigger a new message with a prompt
      }}
    >
      <span className="material-symbols-rounded text-2xl text-primary">{icon}</span>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  )
}
