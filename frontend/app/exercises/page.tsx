"use client"

import { useAuth } from "../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import ExerciseLibrary from "../../components/exercises/ExerciseLibrary"
import { getExercises } from "../../services/api"
import type { Exercise } from "../../types"

export default function ExercisesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadExercises()
    }
  }, [user])

  const loadExercises = async () => {
    try {
      const response = await getExercises()
      if (response.success) {
        setExercises(response.data)
      } else {
        console.error("Error loading exercises:", response.message)
      }
    } catch (error) {
      console.error("Error loading exercises:", error)
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
          <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Ejercicios</h1>
          <p className="text-gray-600">Explora nuestra colección de ejercicios organizados por nivel</p>
        </div>

        <ExerciseLibrary exercises={exercises} />
      </div>
    </DashboardLayout>
  )
}
