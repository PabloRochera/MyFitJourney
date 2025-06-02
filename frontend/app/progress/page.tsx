"use client"

import { useAuth } from "../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import ProgressTracking from "../../components/progress/ProgressTracking"
import { getUserProgress } from "../../services/api"

export default function ProgressPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [progress, setProgress] = useState([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadProgress()
    }
  }, [user])

  const loadProgress = async () => {
    try {
      const response = await getUserProgress()
      if (response.success) {
        setProgress(response.data)
      } else {
        console.error("Error loading progress:", response.message)
      }
    } catch (error) {
      console.error("Error loading progress:", error)
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Mi Progreso</h1>
          <p className="text-gray-600">Registra y visualiza tu evolución física</p>
        </div>
        <ProgressTracking progress={progress} onUpdate={loadProgress} />
      </div>
    </DashboardLayout>
  )
}
