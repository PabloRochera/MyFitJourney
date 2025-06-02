"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { login as apiLogin, register as apiRegister, getProfile } from "../services/api"

interface User {
  id: string
  name: string
  email: string
  height: number
  weight: number
  goal: string
  activityLevel: string
  experience: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const userData = await getProfile()
        setUser(userData)
      }
    } catch (error) {
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password)
    localStorage.setItem("token", response.token)
    setUser(response.user)
  }

  const register = async (userData: any) => {
    const response = await apiRegister(userData)
    localStorage.setItem("token", response.token)
    setUser(response.user)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
