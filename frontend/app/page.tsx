"use client"

import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoginForm from "../components/auth/LoginForm"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <img
        src="/fondo.png"
        alt="Fitness background"
        className="absolute inset-0 w-full h-full object-cover opacity-60 -z-10"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-blue-900/40 -z-10" />
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="max-w-xl w-full bg-white/90 rounded-2xl shadow-2xl p-10 backdrop-blur-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 drop-shadow-lg mb-2 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-600 -rotate-6" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="36" r="20" fill="currentColor" stroke="#2563eb" strokeWidth="3"/>
                <rect x="28" y="10" width="8" height="8" rx="2" fill="#2563eb"/>
                <path d="M32 36V24" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                <path d="M44 36a12 12 0 1 1-24 0 12 12 0 0 1 24 0z" stroke="#fff" strokeWidth="2"/>
              </svg>
              MyFit Journey
            </h1>
            <p className="text-gray-600 text-lg">Tu plataforma de fitness personalizada</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
