import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Clock, Dumbbell, List } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Badge } from "../ui/badge"
import { useState } from "react"
import { useToast } from "../hooks/use-toast"
import { getUserProgress, updateProgress } from "../../services/api"

interface NextWorkoutProps {
  nextWorkout?: {
    title: string
    duration: string
    exercises: number
    difficulty: string
    exerciseList?: { _id: string, title: string, duration?: string, category?: string }[]
  }
  onRoutineCompleted?: () => void
}

export default function NextWorkout({ nextWorkout, onRoutineCompleted }: NextWorkoutProps) {
  const defaultWorkout = {
    title: "No hay entrenamiento programado",
    duration: "0 min",
    exercises: 0,
    difficulty: "N/A",
    exerciseList: []
  }

  const workoutData = nextWorkout || defaultWorkout
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [completing, setCompleting] = useState(false)

  const handleCompleteRoutine = async () => {
    setCompleting(true)
    try {
      // Obtener el último progreso
      const response = await getUserProgress()
      const progressArr = response.data || []
      if (progressArr.length === 0) {
        toast({ title: "No hay progreso registrado", description: "Registra tu progreso antes de completar una rutina.", variant: "destructive" })
        setCompleting(false)
        return
      }
      const latest = [...progressArr].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      const updated = {
        ...latest,
        completedWorkouts: (latest.completedWorkouts || 0) + 1
      }
      await updateProgress(latest._id, updated)
      toast({ title: "¡Rutina completada!", description: "Entrenamiento registrado en tu progreso." })
      setOpen(false)
      if (onRoutineCompleted) onRoutineCompleted()
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudo registrar el entrenamiento", variant: "destructive" })
    } finally {
      setCompleting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          Próximo Entrenamiento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{workoutData.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {workoutData.duration}
            </div>
            <span>{workoutData.exercises} ejercicios</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{workoutData.difficulty}</span>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" disabled={!nextWorkout} onClick={() => setOpen(true)}>
              {nextWorkout ? "Comenzar Entrenamiento" : "No hay entrenamiento programado"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ejercicios de la Rutina</DialogTitle>
            </DialogHeader>
            {workoutData.exerciseList && workoutData.exerciseList.length > 0 ? (
              <div className="space-y-3">
                {workoutData.exerciseList.map((ex) => (
                  <div key={ex._id} className="flex items-center gap-3 p-2 border rounded-md">
                    <List className="h-4 w-4 text-primary" />
                    <span className="font-medium">{ex.title}</span>
                    {ex.category && <Badge variant="outline">{ex.category}</Badge>}
                    {ex.duration && <span className="text-xs text-gray-500 ml-auto">{ex.duration}</span>}
                  </div>
                ))}
                <Button className="w-full mt-4" onClick={handleCompleteRoutine} disabled={completing}>
                  {completing ? "Registrando..." : "Rutina completada"}
                </Button>
              </div>
            ) : (
              <div className="text-gray-500">No hay ejercicios en esta rutina.</div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
