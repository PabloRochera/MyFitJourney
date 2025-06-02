"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Clock, Zap, Search, Filter } from "lucide-react"
import type { Exercise, Routine } from "../../types"
import MyRoutines from "./MyRoutines"
import { addExerciseToRoutine, getUserRoutines } from "../../services/api"
import { useToast } from "../hooks/use-toast"

interface ExerciseLibraryProps {
  exercises: Exercise[]
}

export default function ExerciseLibrary({ exercises = [] }: ExerciseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const { toast } = useToast()
  const [activeRoutine, setActiveRoutine] = useState<any>(null)
  const [addingExerciseId, setAddingExerciseId] = useState<string | null>(null)

  // Asegurarnos de que exercises sea un array
  const exercisesArray = Array.isArray(exercises) ? exercises : []

  // Filtrar ejercicios
  const filteredExercises = exercisesArray.filter((exercise) => {
    const matchesSearch =
      exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "all" || exercise.level === selectedLevel
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory

    return matchesSearch && matchesLevel && matchesCategory
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case "baja":
        return "text-green-600"
      case "moderada":
        return "text-yellow-600"
      case "alta":
        return "text-orange-600"
      case "muy alta":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const handleAddToRoutine = async (exerciseId: string) => {
    if (!activeRoutine) {
      toast({ title: "Selecciona una rutina activa", description: "Debes tener una rutina activa para añadir ejercicios.", variant: "destructive" })
      return
    }
    setAddingExerciseId(exerciseId)
    try {
      await addExerciseToRoutine(activeRoutine._id, exerciseId, {
        sets: 3,
        reps: 12,
        rest: 60,
        weight: 10,
        notes: ""
      })
      toast({ title: "Ejercicio añadido", description: "El ejercicio se ha añadido a tu rutina." })
      // Refrescar rutina activa
      const updatedRoutine = await getUserRoutines()
      const newActiveRoutine = updatedRoutine.data.find((r: Routine) => r._id === activeRoutine._id)
      if (newActiveRoutine) {
        setActiveRoutine(newActiveRoutine)
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudo añadir el ejercicio", variant: "destructive" })
    } finally {
      setAddingExerciseId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Mi Rutina arriba */}
      <MyRoutines allExercises={exercisesArray} onActiveRoutineChange={setActiveRoutine} />
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar ejercicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            <SelectItem value="beginner">Principiante</SelectItem>
            <SelectItem value="intermediate">Intermedio</SelectItem>
            <SelectItem value="advanced">Avanzado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="pecho">Pecho</SelectItem>
            <SelectItem value="piernas">Piernas</SelectItem>
            <SelectItem value="core">Core</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="espalda">Espalda</SelectItem>
            <SelectItem value="brazos">Brazos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de ejercicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Card key={exercise._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                <img
                  src={exercise.image || "/placeholder.svg"}
                  alt={exercise.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-lg">{exercise.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getLevelColor(exercise.level)}>
                  {exercise.level === "beginner"
                    ? "Principiante"
                    : exercise.level === "intermediate"
                      ? "Intermedio"
                      : "Avanzado"}
                </Badge>
                <Badge variant="outline">{exercise.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-2">{exercise.description}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{exercise.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-gray-400" />
                  <span className={getIntensityColor(exercise.intensity)}>{exercise.intensity}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {exercise.muscleGroups.slice(0, 2).map((muscle, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
                {exercise.muscleGroups.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{exercise.muscleGroups.length - 2}
                  </Badge>
                )}
              </div>

              <Button
                className="w-full"
                variant="default"
                onClick={() => handleAddToRoutine(exercise._id)}
                disabled={!activeRoutine || addingExerciseId === exercise._id || (activeRoutine && activeRoutine.exercises.some((e: any) => e._id === exercise._id) || (activeRoutine && activeRoutine.exercises.length >= 10))}
              >
                {addingExerciseId === exercise._id ? "Añadiendo..." : activeRoutine && activeRoutine.exercises.some((e: any) => e._id === exercise._id) ? "Ya en tu rutina" : activeRoutine && activeRoutine.exercises.length >= 10 ? "Máximo 10 ejercicios" : "Añadir a Mi Rutina"}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedExercise(exercise)}>
                    Ver Detalles
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{exercise.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={exercise.image || "/placeholder.svg"}
                        alt={exercise.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Badge className={getLevelColor(exercise.level)}>
                        {exercise.level === "beginner"
                          ? "Principiante"
                          : exercise.level === "intermediate"
                            ? "Intermedio"
                            : "Avanzado"}
                      </Badge>
                      <Badge variant="outline">{exercise.category}</Badge>
                    </div>

                    <p className="text-gray-700">{exercise.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Duración:</span> {exercise.duration}
                      </div>
                      <div>
                        <span className="font-medium">Intensidad:</span>
                        <span className={getIntensityColor(exercise.intensity)}> {exercise.intensity}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Grupos Musculares:</h4>
                      <div className="flex flex-wrap gap-1">
                        {exercise.muscleGroups.map((muscle, index) => (
                          <Badge key={index} variant="secondary">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Equipamiento:</h4>
                      <div className="flex flex-wrap gap-1">
                        {exercise.equipment.map((item, index) => (
                          <Badge key={index} variant="outline">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Instrucciones:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                        {exercise.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron ejercicios que coincidan con los filtros.</p>
        </div>
      )}
    </div>
  )
}
