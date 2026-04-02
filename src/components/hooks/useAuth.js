import { useState, useEffect, useCallback } from 'react'
import { getUser, setUser, logout as storageLogout } from '../lib/storage'
import { Trash2 } from 'lucide-react'

export function useAuth() {
  const [user, setUserState] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = getUser()
    if (storedUser) {
      setUserState(storedUser)
    }
    setLoading(false)
  }, [])

  const login = useCallback((username) => {
    const newUser = {
      id: Date.now().toString(),
      username: username.trim(),
      createdAt: new Date().toISOString()
    }
    setUser(newUser)
    setUserState(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    storageLogout()
    setUserState(null)
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  }
}
