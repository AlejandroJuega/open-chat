import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  getChats, 
  saveChats, 
  addChat as storageAddChat,
  updateChat as storageUpdateChat,
  deleteChat as storageDeleteChat,
  getChat,
  getCurrentChatId,
  setCurrentChatId
} from '../lib/storage'
import { sendMessage } from '../lib/api'
import { generateId, truncateText } from '../lib/utils'

export function useChat() {
  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChatState] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const abortControllerRef = useRef(null)

  // Load chats on mount
  useEffect(() => {
    const loadedChats = getChats()
    setChats(loadedChats)
    
    const currentId = getCurrentChatId()
    if (currentId) {
      const chat = getChat(currentId)
      if (chat) {
        setCurrentChatState(chat)
        setMessages(chat.messages || [])
      }
    }
  }, [])

  // Create new chat
  const createNewChat = useCallback(() => {
    const newChat = {
      id: generateId(),
      title: 'Nueva conversación',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    storageAddChat(newChat)
    setChats(prev => [newChat, ...prev])
    setCurrentChatState(newChat)
    setMessages([])
    setCurrentChatId(newChat.id)
    
    return newChat
  }, [])

  // Load chat
  const loadChat = useCallback((chatId) => {
    const chat = getChat(chatId)
    if (chat) {
      setCurrentChatState(chat)
      setMessages(chat.messages || [])
      setCurrentChatId(chatId)
    }
  }, [])

  // Delete chat
  const deleteChatById = useCallback((chatId) => {
    storageDeleteChat(chatId)
    setChats(prev => prev.filter(c => c.id !== chatId))
    
    if (currentChat?.id === chatId) {
      if (chats.length > 1) {
        const nextChat = chats.find(c => c.id !== chatId)
        if (nextChat) {
          loadChat(nextChat.id)
        } else {
          createNewChat()
        }
      } else {
        createNewChat()
      }
    }
  }, [currentChat, chats, loadChat, createNewChat])

  // Send message
  const sendUserMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return

    const userMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      createdAt: new Date().toISOString()
    }

    // Add message to state
    setMessages(prev => {
      const newMessages = [...prev, userMessage]
      
      // Update or create chat
      if (currentChat) {
        const updatedChat = {
          ...currentChat,
          messages: newMessages,
          updatedAt: new Date().toISOString()
        }
        
        // Set title from first message
        if (!currentChat.title || currentChat.title === 'Nueva conversación') {
          updatedChat.title = truncateText(content, 30)
        }
        
        storageUpdateChat(currentChat.id, updatedChat)
        setCurrentChatState(updatedChat)
        setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c))
      } else {
        // Create new chat if none selected
        const newChat = createNewChat()
        const updatedChat = {
          ...newChat,
          messages: newMessages,
          title: truncateText(content, 30)
        }
        storageUpdateChat(newChat.id, updatedChat)
        setCurrentChatState(updatedChat)
        setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c))
      }
      
      return newMessages
    })

    // Add temporary assistant message
    const tempAssistantMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isTemporary: true
    }
    
    setMessages(prev => [...prev, tempAssistantMessage])
    setIsLoading(true)

    try {
      await sendMessage(
        [...messages, userMessage],
        (delta, fullContent) => {
          setMessages(prev => prev.map(msg => 
            msg.id === tempAssistantMessage.id 
              ? { ...msg, content: fullContent, isTemporary: false }
              : msg
          ))
        },
        (finalContent) => {
          setMessages(prev => prev.map(msg => 
            msg.id === tempAssistantMessage.id 
              ? { ...msg, content: finalContent, isTemporary: false }
              : msg
          ))
          setIsLoading(false)
        },
        (errorMessage) => {
          setMessages(prev => prev.map(msg => 
            msg.id === tempAssistantMessage.id 
              ? { ...msg, content: `Error: ${errorMessage}`, isError: true, isTemporary: false }
              : msg
          ))
          setIsLoading(false)
        }
      )
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
    }
  }, [currentChat, messages, isLoading, createNewChat])

  // Clear current chat
  const clearChat = useCallback(() => {
    setMessages([])
    if (currentChat) {
      const updatedChat = {
        ...currentChat,
        messages: [],
        updatedAt: new Date().toISOString()
      }
      storageUpdateChat(currentChat.id, updatedChat)
      setCurrentChatState(updatedChat)
      setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c))
    }
  }, [currentChat])

  // Stop generating
  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }, [])

  // Update connection status
  const setConnected = useCallback((connected) => {
    setIsConnected(connected)
  }, [])

  return {
    chats,
    currentChat,
    messages,
    isLoading,
    isConnected,
    createNewChat,
    loadChat,
    deleteChat: deleteChatById,
    sendMessage: sendUserMessage,
    clearChat,
    stopGenerating,
    setConnected
  }
}
