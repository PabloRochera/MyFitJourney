import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Apple, Utensils } from "lucide-react"
import type { Diet } from "../../types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Badge } from "../ui/badge"

interface NutritionPlanProps {
  nutritionPlan: Diet | null
}

export default function NutritionPlan({ nutritionPlan }: NutritionPlanProps) {
  const defaultPlan = {
    title: "No hay plan activo",
    calories: 0,
    macros: {
      protein: 0,
      carbs: 0,
      fat: 0
    },
    meals: []
  }

  const planData = nutritionPlan || defaultPlan

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Apple className="h-5 w-5 text-primary" />
          Plan Nutricional Activo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{planData.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{planData.calories} calorías diarias</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-blue-600">{planData.macros.protein}%</div>
            <div className="text-xs text-gray-600">Proteínas</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">{planData.macros.carbs}%</div>
            <div className="text-xs text-gray-600">Carbohidratos</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-yellow-600">{planData.macros.fat}%</div>
            <div className="text-xs text-gray-600">Grasas</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Utensils className="h-4 w-4" />
          {planData.meals.length} comidas planificadas
        </div>

        {nutritionPlan && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Ver Plan Completo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-primary" />
                  {nutritionPlan.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-gray-600">{nutritionPlan.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Calorías Diarias</h3>
                    <p className="text-2xl font-bold text-primary">{nutritionPlan.calories} kcal</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Macronutrientes</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Proteínas</span>
                        <span className="font-medium">{nutritionPlan.macros.protein}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbohidratos</span>
                        <span className="font-medium">{nutritionPlan.macros.carbs}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Grasas</span>
                        <span className="font-medium">{nutritionPlan.macros.fat}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {nutritionPlan.meals.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Comidas</h3>
                    <div className="space-y-2">
                      {nutritionPlan.meals.map((meal, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium">{meal.name}</h4>
                          <p className="text-sm text-gray-600">{meal.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {nutritionPlan.benefits.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Beneficios</h3>
                    <div className="flex flex-wrap gap-2">
                      {nutritionPlan.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {Object.entries(nutritionPlan.preferences).some(([_, value]) => value) && (
                  <div>
                    <h3 className="font-semibold mb-2">Preferencias</h3>
                    <div className="flex flex-wrap gap-2">
                      {nutritionPlan.preferences.vegetarian && (
                        <Badge variant="outline">Vegetariano</Badge>
                      )}
                      {nutritionPlan.preferences.vegan && (
                        <Badge variant="outline">Vegano</Badge>
                      )}
                      {nutritionPlan.preferences.glutenFree && (
                        <Badge variant="outline">Sin Gluten</Badge>
                      )}
                      {nutritionPlan.preferences.lactoseFree && (
                        <Badge variant="outline">Sin Lactosa</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {!nutritionPlan && (
          <Button variant="outline" className="w-full" disabled>
            No hay plan activo
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
