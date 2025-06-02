"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { TrendingUp } from "lucide-react"

interface ProgressChartProps {
  data: any[]
}

export default function ProgressChart({ data = [] }: ProgressChartProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progreso de Peso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            No hay datos de progreso disponibles
          </div>
        </CardContent>
      </Card>
    )
  }

  const latestWeight = data[data.length - 1]?.weight || 0
  const previousWeight = data[data.length - 2]?.weight || 0
  const weightChange = latestWeight - previousWeight

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Progreso de Peso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{latestWeight} kg</p>
              <p className="text-sm text-gray-600">Peso actual</p>
            </div>
            <div
              className={`text-sm font-medium ${
                weightChange < 0 ? "text-green-600" : weightChange > 0 ? "text-red-600" : "text-gray-600"
              }`}
            >
              {weightChange > 0 ? "+" : ""}
              {weightChange.toFixed(1)} kg
            </div>
          </div>

          {/* Gráfico simple con barras */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Últimas mediciones</p>
            <div className="space-y-1">
              {data.slice(-5).map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-20">{new Date(entry.date).toLocaleDateString()}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(entry.weight / 80) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-12">{entry.weight} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
