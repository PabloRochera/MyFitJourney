import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Activity, Calendar, Flame, Target } from "lucide-react"

interface StatsCardsProps {
  stats: {
    completedWorkouts: number
    totalCalories: number
    activeDays: number
    currentStreak: number
  } | null
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const defaultStats = {
    completedWorkouts: 0,
    totalCalories: 0,
    activeDays: 0,
    currentStreak: 0,
  }

  const statsData = stats || defaultStats

  const cards = [
    {
      title: "Entrenamientos",
      value: statsData.completedWorkouts,
      icon: Activity,
      description: "Completados este mes",
    },
    {
      title: "Calorías",
      value: statsData.totalCalories,
      icon: Flame,
      description: "Quemadas esta semana",
    },
    {
      title: "Días Activos",
      value: statsData.activeDays,
      icon: Calendar,
      description: "En los últimos 30 días",
    },
    {
      title: "Racha Actual",
      value: statsData.currentStreak,
      icon: Target,
      description: "Días consecutivos",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-gray-500">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
