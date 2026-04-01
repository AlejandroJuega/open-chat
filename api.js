// ========================
// API - Conexión con LM Studio
// ========================

import { getSettings } from './storage'

// ========================
// FETCH MODELS
// ========================

export async function fetchModels() {
  const settings = getSettings()
  
  try {
    const response = await fetch(`${settings.lmUrl}/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map(model => ({
        id: model.id,
        name: model.id.split('/').pop() || model.id,
        provider: model.id.includes('/') ? model.id.split('/')[0] : 'local'
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching models:', error)
    throw error
  }
}

// ========================
// CHECK CONNECTION
// ========================

export async function checkConnection() {
  const settings = getSettings()
  
  try {
    const response = await fetch(`${settings.lmUrl}/models`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    })
    return response.ok
  } catch {
    return false
  }
}

// ========================
// SEND MESSAGE
// ========================

export async function sendMessage(messages, onChunk, onComplete, onError) {
  const settings = getSettings()
  
  const requestBody = {
    model: settings.model || 'local-model',
    messages: messages.map(m => ({
      role: m.role,
      content: m.content
    })),
    stream: true,
    temperature: settings.temperature,
    max_tokens: settings.maxTokens
  }
  
  try {
    const response = await fetch(`${settings.lmUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || `Error: ${response.status}`)
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''
    
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          
          if (data === '[DONE]') {
            onComplete(fullContent)
            return fullContent
          }
          
          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            
            if (delta) {
              fullContent += delta
              onChunk(delta, fullContent)
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
    
    onComplete(fullContent)
    return fullContent
    
  } catch (error) {
    console.error('Error sending message:', error)
    onError(error.message || 'Error de conexión')
    throw error
  }
}

// ========================
// NON-STREAMING MESSAGE
// ========================

export async function sendMessageSimple(messages) {
  const settings = getSettings()
  
  const requestBody = {
    model: settings.model || 'local-model',
    messages: messages.map(m => ({
      role: m.role,
      content: m.content
    })),
    stream: false,
    temperature: settings.temperature,
    max_tokens: settings.maxTokens
  }
  
  try {
    const response = await fetch(`${settings.lmUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || `Error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
    
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}
