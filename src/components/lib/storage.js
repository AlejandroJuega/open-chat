// ========================
// STORAGE - Persistencia local
// ========================

const STORAGE_KEYS = {
  CHATS: 'openchat_chats',
  USER: 'openchat_user',
  SETTINGS: 'openchat_settings',
  CURRENT_CHAT: 'openchat_current_chat'
}

// ========================
// CHATS
// ========================

export function getChats() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHATS)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('Error loading chats:', e)
    return []
  }
}

export function saveChats(chats) {
  try {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats))
  } catch (e) {
    console.error('Error saving chats:', e)
  }
}

export function addChat(chat) {
  const chats = getChats()
  chats.unshift(chat)
  saveChats(chats)
  return chat
}

export function updateChat(chatId, updates) {
  const chats = getChats()
  const index = chats.findIndex(c => c.id === chatId)
  if (index !== -1) {
    chats[index] = { ...chats[index], ...updates }
    saveChats(chats)
    return chats[index]
  }
  return null
}

export function deleteChat(chatId) {
  const chats = getChats()
  const filtered = chats.filter(c => c.id !== chatId)
  saveChats(filtered)
}

export function getChat(chatId) {
  const chats = getChats()
  return chats.find(c => c.id === chatId)
}

// ========================
// USER
// ========================

export function getUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    return data ? JSON.parse(data) : null
  } catch (e) {
    return null
  }
}

export function setUser(user) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.removeItem(STORAGE_KEYS.CURRENT_CHAT)
}

// ========================
// SETTINGS
// ========================

export function getSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return data ? JSON.parse(data) : {
      lmUrl: 'http://localhost:1234/v1',
      model: '',
      temperature: 0.7,
      maxTokens: 2048,
      theme: 'dark'
    }
  } catch (e) {
    return {
      lmUrl: 'http://localhost:1234/v1',
      model: '',
      temperature: 0.7,
      maxTokens: 2048,
      theme: 'dark'
    }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

// ========================
// CURRENT CHAT
// ========================

export function getCurrentChatId() {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT)
}

export function setCurrentChatId(chatId) {
  if (chatId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT, chatId)
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_CHAT)
  }
}
