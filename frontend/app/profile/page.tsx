"use client"

import { useAuth } from "../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import ProfileForm from "../../components/profile/ProfileForm"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">Actualiza tu información personal y objetivos</p>
        </div>

        <ProfileForm user={user} />
      </div>
    </DashboardLayout>
  )
}
