"use client"

import { useAuth } from "../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import StatsCards from "../../components/dashboard/StatsCards"
import NextWorkout from "../../components/dashboard/NextWorkout"
import NutritionPlan from "../../components/dashboard/NutritionPlan"
import ProgressChart from "../../components/dashboard/ProgressChart"
import { getUserProgress, getUserStats, getUserDiets, getUserRoutines } from "../../services/api"
import type { Diet, Exercise } from "../../types"

interface Routine {
  _id: string
  name: string
  exercises: Exercise[]
  isActive: boolean
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [progress, setProgress] = useState([])
  const [activeDiet, setActiveDiet] = useState<Diet | null>(null)
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      const [statsData, progressData, dietsData, routinesData] = await Promise.all([
        getUserStats(),
        getUserProgress(),
        getUserDiets({ isActive: true }),
        getUserRoutines()
      ])
      setStats(statsData.data)
      setProgress(progressData.data)
      setActiveDiet(dietsData.data[0] || null)
      const routines: Routine[] = routinesData.data || []
      const active = routines.find((r) => r.isActive)
      setActiveRoutine(active || null)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
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
          <h1 className="text-3xl font-bold text-gray-900">Inicio</h1>
          <p className="text-gray-600">Aquí tienes tu resumen de progreso</p>
        </div>

        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NextWorkout
            nextWorkout={activeRoutine ? {
              title: activeRoutine.name,
              duration: `${activeRoutine.exercises?.length * 5 || 0} min`,
              exercises: activeRoutine.exercises?.length || 0,
              difficulty: activeRoutine.exercises?.length > 7 ? "Alta" : activeRoutine.exercises?.length > 3 ? "Media" : "Baja",
              exerciseList: activeRoutine.exercises?.map(ex => ({
                _id: ex._id,
                title: ex.title,
                duration: ex.duration,
                category: ex.category
              })) || []
            } : undefined}
            onRoutineCompleted={loadDashboardData}
          />
          <NutritionPlan nutritionPlan={activeDiet} />
        </div>

        <ProgressChart data={progress} />
      </div>
    </DashboardLayout>
  )
}
