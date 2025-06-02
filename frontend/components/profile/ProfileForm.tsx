"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Alert, AlertDescription } from "../ui/alert"
import { User, Target, Activity, Save } from "lucide-react"
import { updateProfile } from "../../services/api"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../hooks/use-toast"

interface User {
  name: string
  email: string
  height?: number
  weight?: number
  goal?: string
  activityLevel?: string
  experience?: string
  age?: number
  gender?: string
  medicalConditions?: string[]
  dietaryRestrictions?: string[]
}

interface ProfileFormProps {
  user: User
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { updateUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    height: user.height?.toString() || "",
    weight: user.weight?.toString() || "",
    goal: user.goal || "",
    activityLevel: user.activityLevel || "",
    experience: user.experience || "",
    age: user.age?.toString() || "",
    gender: user.gender || "",
    medicalConditions: user.medicalConditions?.join(", ") || "",
    dietaryRestrictions: user.dietaryRestrictions?.join(", ") || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedData = {
        ...formData,
        height: Number.parseInt(formData.height),
        weight: Number.parseInt(formData.weight),
        age: Number.parseInt(formData.age),
        medicalConditions: formData.medicalConditions.split(",").map(c => c.trim()).filter(Boolean),
        dietaryRestrictions: formData.dietaryRestrictions.split(",").map(r => r.trim()).filter(Boolean),
      }

      const response = await updateProfile(updatedData)
      if (response.success) {
        updateUser(response.data)
        toast({
          title: "Perfil actualizado",
          description: "Tus datos han sido guardados exitosamente",
        })
      } else {
        throw new Error(response.message || "Error al actualizar el perfil")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const calculateBMI = () => {
    const height = Number.parseInt(formData.height)
    const weight = Number.parseInt(formData.weight)
    if (height && weight) {
      const heightInMeters = height / 100
      return (weight / (heightInMeters * heightInMeters)).toFixed(1)
    }
    return null
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Bajo peso", color: "text-blue-600" }
    if (bmi < 25) return { category: "Peso normal", color: "text-green-600" }
    if (bmi < 30) return { category: "Sobrepeso", color: "text-yellow-600" }
    return { category: "Obesidad", color: "text-red-600" }
  }

  const bmi = calculateBMI()
  const bmiInfo = bmi ? getBMICategory(Number.parseFloat(bmi)) : null

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Información Personal
          </TabsTrigger>
          <TabsTrigger value="physical" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Datos Físicos
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Objetivos
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Edad</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Femenino</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefiero no decirlo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="physical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medidas Corporales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="170"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="70"
                      required
                    />
                  </div>
                </div>

                {bmi && bmiInfo && (
                  <Alert>
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <span>
                          Tu IMC actual es: <strong>{bmi}</strong>
                        </span>
                        <span className={`font-medium ${bmiInfo.color}`}>{bmiInfo.category}</span>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label>Nivel de actividad</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value) => handleSelectChange("activityLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu nivel de actividad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentario</SelectItem>
                      <SelectItem value="light">Ligero</SelectItem>
                      <SelectItem value="moderate">Moderado</SelectItem>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="very_active">Muy activo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nivel de experiencia</Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) => handleSelectChange("experience", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu nivel de experiencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Principiante</SelectItem>
                      <SelectItem value="intermediate">Intermedio</SelectItem>
                      <SelectItem value="advanced">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Objetivos y Preferencias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Objetivo principal</Label>
                  <Select
                    value={formData.goal}
                    onValueChange={(value) => handleSelectChange("goal", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">Pérdida de peso</SelectItem>
                      <SelectItem value="muscle_gain">Ganancia muscular</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      <SelectItem value="endurance">Mejora de resistencia</SelectItem>
                      <SelectItem value="strength">Aumento de fuerza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Condiciones médicas (separadas por comas)</Label>
                  <Input
                    id="medicalConditions"
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    placeholder="Ej: Hipertensión, Diabetes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietaryRestrictions">Restricciones dietéticas (separadas por comas)</Label>
                  <Input
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    placeholder="Ej: Sin gluten, Vegetariano"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </div>
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
