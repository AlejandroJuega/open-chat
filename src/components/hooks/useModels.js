import { useState, useEffect, useCallback } from 'react'
import { fetchModels, checkConnection } from '../lib/api'
import { getSettings, saveSettings } from '../lib/storage'

export function useModels() {
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  // Load saved settings
  useEffect(() => {
    const settings = getSettings()
    if (settings.model) {
      setSelectedModel(settings.model)
    }
  }, [])

  // Check connection
  const checkLmConnection = useCallback(async () => {
    const connected = await checkConnection()
    setIsConnected(connected)
    return connected
  }, [])

  // Load models from LM Studio
  const loadModels = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const connected = await checkLmConnection()
      
      if (!connected) {
        setError('No se puede conectar a LM Studio. Asegúrate de que está abierto.')
        setIsConnected(false)
        setModels([])
        return []
      }
      
      setIsConnected(true)
      const loadedModels = await fetchModels()
      setModels(loadedModels)
      
      // Auto-select first model if none selected
      if (!selectedModel && loadedModels.length > 0) {
        setSelectedModel(loadedModels[0].id)
        const settings = getSettings()
        saveSettings({ ...settings, model: loadedModels[0].id })
      }
      
      return loadedModels
    } catch (err) {
      setError(err.message || 'Error al cargar modelos')
      setIsConnected(false)
      setModels([])
      return []
    } finally {
      setIsLoading(false)
    }
  }, [selectedModel, checkLmConnection])

  // Select model
  const selectModel = useCallback((modelId) => {
    setSelectedModel(modelId)
    const settings = getSettings()
    saveSettings({ ...settings, model: modelId })
  }, [])

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    const settings = getSettings()
    const updated = { ...settings, ...newSettings }
    saveSettings(updated)
    
    if (newSettings.lmUrl && newSettings.lmUrl !== settings.lmUrl) {
      // Reload models if URL changed
      setSelectedModel('')
      loadModels()
    }
  }, [loadModels])

  // Get current settings
  const getCurrentSettings = useCallback(() => {
    return getSettings()
  }, [])

  return {
    models,
    selectedModel,
    isLoading,
    error,
    isConnected,
    loadModels,
    selectModel,
    updateSettings,
    getCurrentSettings,
    checkConnection: checkLmConnection
  }
}
