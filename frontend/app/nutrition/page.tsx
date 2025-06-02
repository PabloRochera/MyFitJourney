"use client"

import { useAuth } from "../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import NutritionPlans from "../../components/nutrition/NutritionPlans"
import { getUserDiets } from "../../services/api"
import type { Diet } from "../../types"

export default function NutritionPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [diets, setDiets] = useState<Diet[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadDiets()
    }
  }, [user])

  const loadDiets = async () => {
    try {
      console.log("Cargando dietas...")
      const response = await getUserDiets({ limit: 50 })
      console.log("Respuesta de la API:", response)
      
      if (response.success && Array.isArray(response.data)) {
        console.log("Dietas cargadas:", response.data)
        setDiets(response.data)
      } else {
        console.error("Error en el formato de la respuesta:", response)
        setDiets([])
      }
    } catch (error) {
      console.error("Error al cargar dietas:", error)
      setDiets([])
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
          <h1 className="text-3xl font-bold text-gray-900">Planes Nutricionales</h1>
          <p className="text-gray-600">Gestiona tus planes de alimentación personalizados</p>
        </div>

        <NutritionPlans diets={diets} onUpdate={loadDiets} />
      </div>
    </DashboardLayout>
  )
}
