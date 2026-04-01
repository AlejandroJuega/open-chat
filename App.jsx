import { useState, useEffect } from 'react'
import { LoginPage } from './components/auth/LoginPage'
import { Sidebar } from './components/sidebar/Sidebar'
import { Header } from './components/shared/Header'
import { ChatContainer } from './components/chat/ChatContainer'
import { ChatInput } from './components/chat/ChatInput'
import { SettingsModal } from './components/modals/SettingsModal'
import { useAuth } from './hooks/useAuth'
import { useChat } from './hooks/useChat'
import { useModels } from './hooks/useModels'

function App() {
  const { user, isAuthenticated, login, logout, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  const {
    chats,
    currentChat,
    messages,
    isLoading,
    isConnected,
    createNewChat,
    loadChat,
    deleteChat,
    sendMessage,
    clearChat,
    stopGenerating,
    setConnected
  } = useChat()

  const {
    models,
    selectedModel,
    isConnected: modelsConnected,
    loadModels,
    selectModel,
    updateSettings,
    checkConnection
  } = useModels()

  // Check connection on mount
  useEffect(() => {
    checkConnection().then(connected => {
      setConnected(connected)
      if (connected) {
        loadModels()
      }
    })
  }, [])

  // Update chat connection status
  useEffect(() => {
    setConnected(modelsConnected)
  }, [modelsConnected])

  // Handle message send
  const handleSendMessage = (content) => {
    sendMessage(content)
  }

  // Handle settings save
  const handleSettingsSave = async (settings) => {
    updateSettings(settings)
    const connected = await checkConnection()
    setConnected(connected)
    if (connected) {
      await loadModels()
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  // Login state
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chats={chats}
        currentChat={currentChat}
        onNewChat={() => {
          createNewChat()
          setSidebarOpen(false)
        }}
        onSelectChat={(chatId) => {
          loadChat(chatId)
          setSidebarOpen(false)
        }}
        onDeleteChat={deleteChat}
        isConnected={modelsConnected}
        models={models}
        selectedModel={selectedModel}
        onSelectModel={selectModel}
        onOpenSettings={() => setSettingsOpen(true)}
        user={user}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          selectedModel={selectedModel}
          onOpenSettings={() => setSettingsOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isConnected={modelsConnected}
        />

        {/* Chat Container */}
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onRegenerate={() => {
            // Regenerate last assistant message
            const lastUserMessage = messages.filter(m => m.role === 'user').pop()
            if (lastUserMessage) {
              // Remove last assistant message and resend
              const msgIndex = messages.findIndex(m => m.id === messages.filter(m => m.role === 'assistant').pop()?.id)
              if (msgIndex > -1) {
                const newMessages = messages.slice(0, msgIndex)
                newMessages.forEach(m => sendMessage(m.content))
              }
            }
          }}
          selectedModel={selectedModel}
          onClearChat={clearChat}
        />

        {/* Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onStop={stopGenerating}
          disabled={!modelsConnected}
        />
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSettingsSave}
        isConnected={modelsConnected}
      />
    </div>
  )
}

export default App
