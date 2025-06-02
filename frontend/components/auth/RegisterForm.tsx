"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function RegisterForm() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    height: "",
    weight: "",
    goal: "",
    activityLevel: "",
    experience: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...userData } = formData
      await register({
        ...userData,
        height: Number.parseInt(userData.height),
        weight: Number.parseInt(userData.weight),
      })
    } catch (error: any) {
      setError(error.message || "Error al crear la cuenta")
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

  return (
    <Card className="w-full max-w-xl mx-auto p-8 md:p-10 shadow-xl rounded-2xl bg-white/95">
      <CardHeader className="space-y-1">
        <div className="mb-4 text-center">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">¡Crea tu cuenta gratis!</span>
        </div>
        <CardTitle className="text-2xl text-center font-bold text-blue-800 flex items-center justify-center gap-2">
          <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2 15.5V18a2 2 0 002 2h2.5M22 8.5V6a2 2 0 00-2-2h-2.5M6.5 20H17.5M6.5 4H17.5M4 6.5V17.5M20 6.5V17.5M7 9v6M17 9v6' /></svg>
          Crear Cuenta
        </CardTitle>
        <CardDescription className="text-center text-gray-500">Completa tus datos para personalizar tu experiencia</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                placeholder="170"
                value={formData.height}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                placeholder="70"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Objetivo</Label>
            <Select onValueChange={(value) => handleSelectChange("goal", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose-weight">Perder peso</SelectItem>
                <SelectItem value="gain-muscle">Ganar músculo</SelectItem>
                <SelectItem value="improve-fitness">Mejorar condición física</SelectItem>
                <SelectItem value="maintain">Mantener peso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nivel de actividad</Label>
            <Select onValueChange={(value) => handleSelectChange("activityLevel", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentario</SelectItem>
                <SelectItem value="light">Ligero</SelectItem>
                <SelectItem value="moderate">Moderado</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="very-active">Muy activo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Experiencia</Label>
            <Select onValueChange={(value) => handleSelectChange("experience", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu experiencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Principiante</SelectItem>
                <SelectItem value="intermediate">Intermedio</SelectItem>
                <SelectItem value="advanced">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-blue-700"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-xl transition" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-600">¿Ya tienes cuenta? </span>
            <Link href="/" className="text-blue-700 hover:underline font-semibold">
              Inicia sesión aquí
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
