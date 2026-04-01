import { useState } from 'react'
import { Settings, Menu, Bot } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

export function Header({ 
  selectedModel, 
  onOpenSettings, 
  onToggleSidebar,
  isConnected
}) {
  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-border bg-secondary/50">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Logo - Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-foreground">AI Chat</span>
        </div>
      </div>

      {/* Center - Model selector */}
      <div className="flex items-center gap-2">
        {selectedModel ? (
          <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
            <span className="material-symbols-rounded text-sm">smart_toy</span>
            {selectedModel.split('/').pop()}
          </Badge>
        ) : (
          <Badge variant="outline" className="hidden sm:flex">
            Sin modelo
          </Badge>
        )}
        
        {/* Connection indicator */}
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onOpenSettings}>
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
