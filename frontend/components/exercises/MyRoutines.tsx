import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Plus, CheckCircle, Trash2, Edit, Dumbbell, Power } from "lucide-react"
import {
  getUserRoutines,
  createRoutine,
  addExerciseToRoutine,
  removeExerciseFromRoutine,
  toggleRoutine,
  deleteRoutine,
  renameRoutine,
} from "../../services/api"
import { useToast } from "../hooks/use-toast"
import type { Exercise, Routine } from "../../types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface MyRoutinesProps {
  allExercises: Exercise[]
  onActiveRoutineChange?: (routine: Routine | null) => void
}

export default function MyRoutines({ allExercises, onActiveRoutineChange }: MyRoutinesProps) {
  const { toast } = useToast()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newRoutineName, setNewRoutineName] = useState("")
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null)

  const loadRoutines = async () => {
    setLoading(true)
    try {
      const res = await getUserRoutines()
      setRoutines(res.data)
    } catch (e) {
      toast({ title: "Error", description: "No se pudieron cargar las rutinas", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoutines()
  }, [])

  useEffect(() => {
    if (onActiveRoutineChange) {
      const active = routines.find(r => r.isActive) || null
      onActiveRoutineChange(active)
    }
  }, [routines, onActiveRoutineChange])

  useEffect(() => {
    if (routines.length > 0) {
      const active = routines.find(r => r.isActive)
      setSelectedRoutineId(active ? active._id : routines[0]._id)
    }
  }, [routines])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoutineName.trim()) return
    setLoading(true)
    try {
      await createRoutine(newRoutineName)
      setShowCreate(false)
      setNewRoutineName("")
      loadRoutines()
    } catch (e) {
      toast({ title: "Error", description: "No se pudo crear la rutina", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRoutine = async (routineId: string) => {
    setLoading(true)
    try {
      const response = await toggleRoutine(routineId)
      toast({ 
        title: response.message, 
        description: response.message === "Rutina activada" ? "Esta rutina es ahora tu rutina activa" : "La rutina ha sido desactivada"
      })
      await loadRoutines()
      if (onActiveRoutineChange) {
        const updatedRoutines = await getUserRoutines()
        const newActiveRoutine = updatedRoutines.data.find((r: Routine) => r.isActive) || null
        onActiveRoutineChange(newActiveRoutine)
      }
    } catch (e) {
      toast({ title: "Error", description: "No se pudo cambiar el estado de la rutina", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (routineId: string) => {
    setLoading(true)
    try {
      await deleteRoutine(routineId)
      loadRoutines()
    } catch (e) {
      toast({ title: "Error", description: "No se pudo eliminar la rutina", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleRename = async (routineId: string) => {
    if (!renameValue.trim()) return
    setLoading(true)
    try {
      await renameRoutine(routineId, renameValue)
      setRenamingId(null)
      setRenameValue("")
      loadRoutines()
    } catch (e) {
      toast({ title: "Error", description: "No se pudo renombrar la rutina", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleAddExercise = async (routineId: string, exerciseId: string) => {
    setLoading(true)
    try {
      await addExerciseToRoutine(routineId, exerciseId)
      loadRoutines()
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "No se pudo añadir el ejercicio", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveExercise = async (routineId: string, exerciseId: string) => {
    setLoading(true)
    try {
      await removeExerciseFromRoutine(routineId, exerciseId)
      loadRoutines()
    } catch (e) {
      toast({ title: "Error", description: "No se pudo quitar el ejercicio", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRoutine = async (routineId: string) => {
    setSelectedRoutineId(routineId)
    await handleToggleRoutine(routineId)
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" /> Mis Rutinas
          </h2>
          {routines.length > 0 && (
            <Select value={selectedRoutineId || undefined} onValueChange={handleSelectRoutine}>
              <SelectTrigger className="w-48 ml-4">
                <SelectValue placeholder="Selecciona rutina" />
              </SelectTrigger>
              <SelectContent>
                {routines.map(routine => (
                  <SelectItem key={routine._id} value={routine._id}>{routine.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Nueva Rutina
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Rutina</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                value={newRoutineName}
                onChange={e => setNewRoutineName(e.target.value)}
                placeholder="Nombre de la rutina"
                required
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creando..." : "Crear Rutina"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routines.map((routine) => (
          <Card key={routine._id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{routine.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={routine.isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleRoutine(routine._id)}
                    disabled={loading}
                  >
                    <Power className="h-4 w-4 mr-1" />
                    {routine.isActive ? "Activa" : "Inactiva"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(routine._id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  {routine.exercises.length} ejercicio{routine.exercises.length !== 1 ? "s" : ""}
                </p>
                {routine.isActive && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Rutina Activa
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 