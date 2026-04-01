import { useState, useEffect } from 'react'
import { 
  Bot, 
  Settings, 
  PanelLeftClose, 
  PanelLeft,
  User,
  LogOut,
  MoreHorizontal,
  Trash2,
  Plus
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { formatDate, truncateText } from '@/lib/utils'

export function Sidebar({ 
  isOpen, 
  onToggle, 
  chats, 
  currentChat, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat,
  isConnected,
  models,
  selectedModel,
  onSelectModel,
  onOpenSettings,
  user,
  onLogout
}) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          h-full w-[280px] 
          bg-secondary border-r border-border
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-foreground">AI Chat</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle} className="lg:hidden">
            <PanelLeftClose className="w-5 h-5" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:bg-accent hover:border-border transition-colors text-foreground"
          >
            <span className="material-symbols-rounded text-lg">edit_square</span>
            <span className="font-medium">Nuevo chat</span>
          </button>
        </div>

        {/* Model Selector */}
        <div className="px-3 mb-2">
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="material-symbols-rounded text-sm text-muted-foreground">smart_toy</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Modelo</span>
          </div>
          <select
            value={selectedModel}
            onChange={(e) => onSelectModel(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="">Seleccionar modelo...</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          
          {/* Connection Status */}
          <div className="flex items-center gap-2 mt-2 px-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3">
          <div className="flex items-center gap-2 px-3 py-2 mt-2">
            <span className="material-symbols-rounded text-sm text-muted-foreground">history</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Historial</span>
          </div>
          
          <div className="space-y-1">
            {chats.length === 0 ? (
              <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                No hay conversaciones
              </p>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`
                    group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer
                    transition-colors
                    ${currentChat?.id === chat.id 
                      ? 'bg-accent' 
                      : 'hover:bg-accent/50'
                    }
                  `}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <span className="material-symbols-rounded text-sm text-muted-foreground flex-shrink-0">
                    chat_bubble_outline
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {chat.title || 'Nueva conversación'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(chat.updatedAt || chat.createdAt)}
                    </p>
                  </div>
                  
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="flex-1 text-left text-sm font-medium text-foreground truncate">
                {user?.username || 'Usuario'}
              </span>
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)} 
                />
                <div className="absolute bottom-full left-0 right-0 mb-2 py-1 rounded-lg bg-card border border-border shadow-lg z-50">
                  <button
                    onClick={() => {
                      onLogout()
                      setShowUserMenu(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors mt-1"
          >
            <span className="material-symbols-rounded">settings</span>
            <span className="text-sm font-medium text-foreground">Configuración</span>
          </button>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 z-30 lg:hidden w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
      >
        {isOpen ? (
          <PanelLeftClose className="w-5 h-5" />
        ) : (
          <PanelLeft className="w-5 h-5" />
        )}
      </button>
    </>
  )
}
