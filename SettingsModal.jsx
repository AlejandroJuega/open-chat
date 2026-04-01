import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { getSettings, saveSettings } from '@/lib/storage'
import { fetchModels } from '@/lib/api'

export function SettingsModal({ isOpen, onClose, onSave, isConnected }) {
  const [settings, setSettings] = useState(getSettings())
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  if (!isOpen) return null

  const handleSave = () => {
    saveSettings(settings)
    onSave(settings)
    onClose()
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    
    try {
      const models = await fetchModels()
      if (models.length > 0) {
        setTestResult({ success: true, message: `Conexión exitosa. ${models.length} modelo(s) encontrado(s).` })
      } else {
        setTestResult({ success: false, message: 'No se encontraron modelos.' })
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Error de conexión.' })
    }
    
    setIsTesting(false)
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-card rounded-xl border border-border shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Configuración</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* LM Studio URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                URL de LM Studio
              </label>
              <Input
                value={settings.lmUrl}
                onChange={(e) => setSettings({ ...settings, lmUrl: e.target.value })}
                placeholder="http://localhost:1234/v1"
              />
              <p className="text-xs text-muted-foreground">
                URL base de la API de LM Studio
              </p>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Temperatura: {settings.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Preciso</span>
                <span>Creativo</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tokens máximos: {settings.maxTokens}
              </label>
              <input
                type="range"
                min="256"
                max="8192"
                step="256"
                value={settings.maxTokens}
                onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Corto</span>
                <span>Largo</span>
              </div>
            </div>

            {/* Test Connection */}
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="w-full"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Probando...
                  </>
                ) : (
                  'Probar conexión'
                )}
              </Button>
              
              {testResult && (
                <p className={`mt-2 text-sm ${testResult.success ? 'text-green-500' : 'text-destructive'}`}>
                  {testResult.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
