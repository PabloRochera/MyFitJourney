"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { Apple, Plus, Utensils, Heart, Power, Eye } from "lucide-react"
import { createDiet, toggleDiet } from "../../services/api"
import { useToast } from "../hooks/use-toast"
import type { Diet } from "../../types"

interface NutritionPlansProps {
  diets: Diet[]
  onUpdate: () => void
}

export default function NutritionPlans({ diets, onUpdate }: NutritionPlansProps) {
  const { toast } = useToast()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [togglingDiet, setTogglingDiet] = useState<string | null>(null)
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    description: "",
    meals: "",
    benefits: "",
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    lactoseFree: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar que los porcentajes de macronutrientes sumen 100%
      const totalMacros = Number.parseInt(formData.protein) + 
                         Number.parseInt(formData.carbs) + 
                         Number.parseInt(formData.fat)
      
      if (totalMacros !== 100) {
        toast({
          title: "Error",
          description: "Los porcentajes de macronutrientes deben sumar 100%",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Validar que las calorías estén dentro del rango
      const calories = Number.parseInt(formData.calories)
      if (calories < 800 || calories > 5000) {
        toast({
          title: "Error",
          description: "Las calorías deben estar entre 800 y 5000",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const protein = Number.parseInt(formData.protein)
      const carbs = Number.parseInt(formData.carbs)
      const fat = Number.parseInt(formData.fat)
      const dietData = {
        title: formData.title.trim(),
        calories: calories,
        protein,
        carbs,
        fat,
        macros: {
          protein,
          carbs,
          fat
        },
        description: formData.description.trim(),
        meals: formData.meals.split("\n")
          .map(meal => {
            const [name, description] = meal.split(":").map(s => s.trim())
            if (!name) return null
            return {
              name,
              description: description || "",
              calories: 100,
              macros: {
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0
              },
              ingredients: [],
              instructions: [],
              prepTime: 0,
              mealType: "breakfast"
            }
          })
          .filter(Boolean),
        benefits: formData.benefits
          .split(",")
          .map((benefit) => benefit.trim())
          .filter(Boolean),
        preferences: {
          vegetarian: formData.vegetarian,
          vegan: formData.vegan,
          glutenFree: formData.glutenFree,
          lactoseFree: formData.lactoseFree,
          nutFree: false,
          lowCarb: false,
          highProtein: false
        },
        restrictions: [],
        isActive: false,
        isTemplate: false
      }

      const response = await createDiet(dietData)
      if (response.success) {
        toast({
          title: "Plan creado",
          description: "Tu plan nutricional ha sido creado exitosamente.",
        })
        setShowCreateForm(false)
        setFormData({
          title: "",
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
          description: "",
          meals: "",
          benefits: "",
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          lactoseFree: false,
        })
        onUpdate()
      } else {
        throw new Error(response.message || "Error al crear el plan")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el plan nutricional. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (dietId: string) => {
    setTogglingDiet(dietId)
    try {
      const response = await toggleDiet(dietId)
      if (response.success) {
        toast({
          title: "Estado actualizado",
          description: response.data.isActive 
            ? "El plan ha sido activado y los demás desactivados" 
            : "El plan ha sido desactivado",
        })
        onUpdate()
      } else {
        throw new Error(response.message || "Error al actualizar el estado del plan")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el estado del plan. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setTogglingDiet(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={() => setShowCreateForm(true)}>Crear Nuevo Plan</Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Plan Nutricional</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calories">Calorías Diarias</Label>
                  <Input
                    id="calories"
                    name="calories"
                    type="number"
                    value={formData.calories}
                    onChange={handleInputChange}
                    required
                    min={800}
                    max={5000}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="protein">Proteínas (%)</Label>
                  <Input
                    id="protein"
                    name="protein"
                    type="number"
                    value={formData.protein}
                    onChange={handleInputChange}
                    required
                    min={10}
                    max={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbohidratos (%)</Label>
                  <Input
                    id="carbs"
                    name="carbs"
                    type="number"
                    value={formData.carbs}
                    onChange={handleInputChange}
                    required
                    min={5}
                    max={70}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Grasas (%)</Label>
                  <Input
                    id="fat"
                    name="fat"
                    type="number"
                    value={formData.fat}
                    onChange={handleInputChange}
                    required
                    min={15}
                    max={80}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meals">Comidas (una por línea, formato: "Nombre: Descripción")</Label>
                <Textarea
                  id="meals"
                  name="meals"
                  value={formData.meals}
                  onChange={handleInputChange}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Beneficios (separados por comas)</Label>
                <Input
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Preferencias</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vegetarian"
                      checked={formData.vegetarian}
                      onCheckedChange={(checked) => handleCheckboxChange("vegetarian", checked as boolean)}
                    />
                    <Label htmlFor="vegetarian">Vegetariano</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vegan"
                      checked={formData.vegan}
                      onCheckedChange={(checked) => handleCheckboxChange("vegan", checked as boolean)}
                    />
                    <Label htmlFor="vegan">Vegano</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="glutenFree"
                      checked={formData.glutenFree}
                      onCheckedChange={(checked) => handleCheckboxChange("glutenFree", checked as boolean)}
                    />
                    <Label htmlFor="glutenFree">Sin Gluten</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lactoseFree"
                      checked={formData.lactoseFree}
                      onCheckedChange={(checked) => handleCheckboxChange("lactoseFree", checked as boolean)}
                    />
                    <Label htmlFor="lactoseFree">Sin Lactosa</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creando..." : "Crear Plan"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {diets.map((diet) => (
          <Card key={diet._id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{diet.title}</span>
                  {diet.isTemplate && (
                    <Badge variant="secondary">Plantilla</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedDiet(diet)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Apple className="h-5 w-5 text-primary" />
                          {diet.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-2">Descripción</h3>
                          <p className="text-gray-600">{diet.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold mb-2">Calorías Diarias</h3>
                            <p className="text-2xl font-bold text-primary">{diet.calories} kcal</p>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Macronutrientes</h3>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Proteínas</span>
                                <span className="font-medium">{diet.macros.protein}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Carbohidratos</span>
                                <span className="font-medium">{diet.macros.carbs}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Grasas</span>
                                <span className="font-medium">{diet.macros.fat}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {diet.meals.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">Comidas</h3>
                            <div className="space-y-2">
                              {diet.meals.map((meal, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                  <h4 className="font-medium">{meal.name}</h4>
                                  <p className="text-sm text-gray-600">{meal.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {diet.benefits.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">Beneficios</h3>
                            <div className="flex flex-wrap gap-2">
                              {diet.benefits.map((benefit, index) => (
                                <Badge key={index} variant="secondary">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {Object.entries(diet.preferences).some(([_, value]) => value) && (
                          <div>
                            <h3 className="font-semibold mb-2">Preferencias</h3>
                            <div className="flex flex-wrap gap-2">
                              {diet.preferences.vegetarian && (
                                <Badge variant="outline">Vegetariano</Badge>
                              )}
                              {diet.preferences.vegan && (
                                <Badge variant="outline">Vegano</Badge>
                              )}
                              {diet.preferences.glutenFree && (
                                <Badge variant="outline">Sin Gluten</Badge>
                              )}
                              {diet.preferences.lactoseFree && (
                                <Badge variant="outline">Sin Lactosa</Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  {diet.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      disabled
                    >
                      <Power className="h-4 w-4 mr-2" />
                      Plan Activo
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(diet._id)}
                      disabled={togglingDiet === diet._id}
                    >
                      <Power className="h-4 w-4 mr-2" />
                      {togglingDiet === diet._id ? "Actualizando..." : "Activar Plan"}
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{diet.description}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">{diet.macros.protein}%</div>
                    <div className="text-xs text-gray-600">Proteínas</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{diet.macros.carbs}%</div>
                    <div className="text-xs text-gray-600">Carbohidratos</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-yellow-600">{diet.macros.fat}%</div>
                    <div className="text-xs text-gray-600">Grasas</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Calorías:</strong> {diet.calories} kcal/día
                </div>
                {diet.benefits.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <strong>Beneficios:</strong> {diet.benefits.join(", ")}
                  </div>
                )}
                {diet.meals.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <strong>Comidas:</strong> {diet.meals.length}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
