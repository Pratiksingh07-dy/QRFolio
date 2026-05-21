import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Hydrate user on mount
  useEffect(() => {
    const stored = localStorage.getItem('qrfolio_user')
    const token  = localStorage.getItem('qrfolio_token')
    if (stored && token) {
      setUser(JSON.parse(stored))
      // Verify token is still valid
      api.get('/api/auth/me')
        .then(r => { setUser(r.data); localStorage.setItem('qrfolio_user', JSON.stringify(r.data)) })
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('qrfolio_token', data.access_token)
    localStorage.setItem('qrfolio_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (name, email, username, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, username, password })
    localStorage.setItem('qrfolio_token', data.access_token)
    localStorage.setItem('qrfolio_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('qrfolio_token')
    localStorage.removeItem('qrfolio_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((updated) => {
    setUser(updated)
    localStorage.setItem('qrfolio_user', JSON.stringify(updated))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
