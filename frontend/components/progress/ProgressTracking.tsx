"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Badge } from "../ui/badge"
import { Plus, TrendingUp, TrendingDown, Calendar, Weight, Ruler, Edit, Trash2, Eye } from "lucide-react"
import { addProgress, updateProgress, deleteProgress } from "../../services/api"
import { useToast } from "../hooks/use-toast"
import type { Progress } from "../../types"

interface ProgressTrackingProps {
  progress: Progress[]
  onUpdate: () => void
}

export default function ProgressTracking({ progress, onUpdate }: ProgressTrackingProps) {
  const { toast } = useToast()
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<Progress | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    completedWorkouts: "",
    caloriesConsumed: "",
    notes: "",
  })

  // Ordenar por fecha descendente
  const sortedProgress = [...progress].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const latest = sortedProgress[0]
  const previous = sortedProgress[1]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const progressEntry = {
        date: new Date().toISOString().split("T")[0],
        weight: Number.parseFloat(formData.weight),
        measurements: {
          chest: Number.parseFloat(formData.chest) || 0,
          waist: Number.parseFloat(formData.waist) || 0,
          hips: Number.parseFloat(formData.hips) || 0,
        },
        completedWorkouts: Number.parseInt(formData.completedWorkouts) || 0,
        nutrition: {
          caloriesConsumed: Number.parseInt(formData.caloriesConsumed) || 0,
        },
        notes: formData.notes,
      }

      await addProgress(progressEntry)
      toast({
        title: "Progreso registrado",
        description: "Tu progreso ha sido guardado exitosamente",
      })
      setShowAddForm(false)
      setFormData({
        weight: "",
        chest: "",
        waist: "",
        hips: "",
        completedWorkouts: "",
        caloriesConsumed: "",
        notes: "",
      })
      onUpdate()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar el progreso",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const getWeightTrend = () => {
    if (!progress || progress.length < 2) {
      return {
        change: "0.0",
        trend: "stable"
      }
    }
    const latest = progress[progress.length - 1]
    const previous = progress[progress.length - 2]
    if (!latest?.weight || !previous?.weight) {
      return {
        change: "0.0",
        trend: "stable"
      }
    }
    const change = latest.weight - previous.weight
    return {
      change: change.toFixed(1),
      trend: change < 0 ? "down" : change > 0 ? "up" : "stable",
    }
  }

  const weightTrend = getWeightTrend()

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = {
        ...editForm,
        weight: Number.parseFloat(editForm.weight),
        completedWorkouts: Number.parseInt(editForm.completedWorkouts) || 0,
        measurements: {
          chest: Number.parseFloat(editForm.chest) || 0,
          waist: Number.parseFloat(editForm.waist) || 0,
          hips: Number.parseFloat(editForm.hips) || 0,
        },
        nutrition: {
          caloriesConsumed: Number.parseInt(editForm.caloriesConsumed) || 0,
        },
      }
      // Llama a la API para actualizar
      await updateProgress(selectedEntry!._id, updated)
      toast({ title: "Progreso actualizado" })
      setEditMode(false)
      setShowDetails(false)
      setSelectedEntry(null)
      onUpdate()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo actualizar el progreso", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteProgress(selectedEntry!._id)
      toast({ title: "Registro eliminado" })
      setShowDetails(false)
      setSelectedEntry(null)
      onUpdate()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo eliminar el registro", variant: "destructive" })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con botón agregar */}
      <div className="flex justify-end items-center">
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Progreso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Progreso</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg) *</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="70.5"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="chest">Pecho (cm)</Label>
                  <Input
                    id="chest"
                    name="chest"
                    type="number"
                    value={formData.chest}
                    onChange={handleChange}
                    placeholder="95"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">Cintura (cm)</Label>
                  <Input
                    id="waist"
                    name="waist"
                    type="number"
                    value={formData.waist}
                    onChange={handleChange}
                    placeholder="80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hips">Cadera (cm)</Label>
                  <Input
                    id="hips"
                    name="hips"
                    type="number"
                    value={formData.hips}
                    onChange={handleChange}
                    placeholder="95"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="completedWorkouts">Entrenamientos</Label>
                  <Input
                    id="completedWorkouts"
                    name="completedWorkouts"
                    type="number"
                    value={formData.completedWorkouts}
                    onChange={handleChange}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caloriesConsumed">Calorías</Label>
                  <Input
                    id="caloriesConsumed"
                    name="caloriesConsumed"
                    type="number"
                    value={formData.caloriesConsumed}
                    onChange={handleChange}
                    placeholder="2000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Añade notas sobre tu progreso..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen de progreso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Peso Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {latest?.weight || "N/A"} kg
              </div>
              {weightTrend.trend !== "stable" && (
                <Badge variant={weightTrend.trend === "down" ? "default" : "destructive"}>
                  {weightTrend.trend === "down" ? (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  )}
                  {weightTrend.change} kg
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entrenamientos Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latest?.completedWorkouts || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calorías Consumidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latest?.nutrition?.caloriesConsumed || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de progreso */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Progreso</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedProgress.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay registros de progreso. ¡Comienza a registrar tu evolución!
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProgress.map((entry) => (
                <div key={entry._id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => { setSelectedEntry(entry); setShowDetails(true); setEditMode(false); setEditForm(null); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-gray-500" />
                      <span>Pecho: {entry.measurements?.chest || "N/A"} cm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-gray-500" />
                      <span>Cintura: {entry.measurements?.waist || "N/A"} cm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-gray-500" />
                      <span>Cadera: {entry.measurements?.hips || "N/A"} cm</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles, edición y eliminación */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles del Progreso</DialogTitle>
          </DialogHeader>
          {selectedEntry && !editMode && (
            <div className="space-y-4">
              <div>
                <strong>Fecha:</strong> {new Date(selectedEntry.date).toLocaleDateString()}
              </div>
              <div>
                <strong>Peso:</strong> {selectedEntry.weight} kg
              </div>
              <div>
                <strong>Pecho:</strong> {selectedEntry.measurements?.chest || "N/A"} cm
              </div>
              <div>
                <strong>Cintura:</strong> {selectedEntry.measurements?.waist || "N/A"} cm
              </div>
              <div>
                <strong>Cadera:</strong> {selectedEntry.measurements?.hips || "N/A"} cm
              </div>
              <div>
                <strong>Entrenamientos:</strong> {selectedEntry.completedWorkouts || 0}
              </div>
              <div>
                <strong>Calorías consumidas:</strong> {selectedEntry.nutrition?.caloriesConsumed || 0}
              </div>
              <div>
                <strong>Notas:</strong> {selectedEntry.notes || "-"}
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => { setEditMode(true); setEditForm({
                  ...selectedEntry,
                  chest: selectedEntry.measurements?.chest || "",
                  waist: selectedEntry.measurements?.waist || "",
                  hips: selectedEntry.measurements?.hips || "",
                  caloriesConsumed: selectedEntry.nutrition?.caloriesConsumed || "",
                }) }}>
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  <Trash2 className="h-4 w-4 mr-1" /> {deleting ? "Eliminando..." : "Eliminar"}
                </Button>
                <Button variant="outline" onClick={() => setShowDetails(false)}>Cerrar</Button>
              </div>
            </div>
          )}
          {selectedEntry && editMode && (
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <Label>Peso (kg)</Label>
                <Input name="weight" type="number" step="0.1" value={editForm.weight} onChange={handleEditChange} required />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Pecho (cm)</Label>
                  <Input name="chest" type="number" value={editForm.chest} onChange={handleEditChange} />
                </div>
                <div>
                  <Label>Cintura (cm)</Label>
                  <Input name="waist" type="number" value={editForm.waist} onChange={handleEditChange} />
                </div>
                <div>
                  <Label>Cadera (cm)</Label>
                  <Input name="hips" type="number" value={editForm.hips} onChange={handleEditChange} />
                </div>
              </div>
              <div>
                <Label>Entrenamientos</Label>
                <Input name="completedWorkouts" type="number" value={editForm.completedWorkouts} onChange={handleEditChange} />
              </div>
              <div>
                <Label>Calorías consumidas</Label>
                <Input name="caloriesConsumed" type="number" value={editForm.caloriesConsumed} onChange={handleEditChange} />
              </div>
              <div>
                <Label>Notas</Label>
                <Textarea name="notes" value={editForm.notes} onChange={handleEditChange} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar cambios"}</Button>
                <Button type="button" variant="outline" onClick={() => setEditMode(false)}>Cancelar</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
