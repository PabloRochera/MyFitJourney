export interface User {
  id: string
  name: string
  email: string
  height: number
  weight: number
  goal: "lose-weight" | "gain-muscle" | "improve-fitness" | "maintain"
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very-active"
  experience: "beginner" | "intermediate" | "advanced"
  createdAt: string
  updatedAt: string
}

export interface Exercise {
  _id: string
  title: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  duration: string
  intensity: string
  description: string
  instructions: string[]
  image: string
  muscleGroups: string[]
  equipment: string[]
  calories?: number
  videoUrl?: string
  tags?: string[]
  isActive?: boolean
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface TrainingPlan {
  id: string
  userId: string
  title: string
  description: string
  goal: string
  duration: number
  level: string
  days: TrainingDay[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TrainingDay {
  dayOfWeek: number
  exercises: TrainingExercise[]
}

export interface TrainingExercise {
  exerciseId: string
  sets: number
  reps: number
  duration: number
  rest: number
}

export interface Meal {
  name: string
  description: string
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  ingredients: {
    name: string
    amount: string
    unit: string
  }[]
  instructions: string[]
  prepTime: number
  mealType: "breakfast" | "lunch" | "dinner" | "snack" | "pre-workout" | "post-workout"
}

export interface Diet {
  _id: string
  title: string
  description: string
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  meals: Array<{
    name: string
    description: string
    calories: number
    macros: {
      protein: number
      carbs: number
      fat: number
      fiber: number
    }
    ingredients: string[]
    instructions: string[]
    prepTime: number
    mealType: string
  }>
  benefits: string[]
  preferences: {
    vegetarian: boolean
    vegan: boolean
    glutenFree: boolean
    lactoseFree: boolean
    nutFree: boolean
    lowCarb: boolean
    highProtein: boolean
  }
  restrictions: string[]
  isActive: boolean
  isTemplate: boolean
  user: string
  createdAt: string
  updatedAt: string
}

export interface Progress {
  _id: string
  user: string
  date: string
  weight: number
  bodyFatPercentage?: number
  measurements: {
    chest: number
    waist: number
    hips: number
    biceps?: number
    thighs?: number
    neck?: number
  }
  photos?: Array<{
    type: "front" | "side" | "back"
    url: string
    uploadDate: string
  }>
  workoutLog?: Array<{
    exercise: string
    sets: Array<{
      reps: number
      weight: number
      duration: number
      completed: boolean
    }>
    notes?: string
  }>
  nutrition?: {
    caloriesConsumed: number
    macrosConsumed: {
      protein: number
      carbs: number
      fat: number
    }
    waterIntake?: number
  }
  mood?: "excellent" | "good" | "average" | "poor" | "terrible"
  energyLevel?: number
  sleepHours?: number
  sleepQuality?: "excellent" | "good" | "average" | "poor" | "terrible"
  notes?: string
  completedWorkouts: number
  achievements?: string[]
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface Routine {
  _id: string
  name: string
  exercises: Exercise[]
  isActive: boolean
  user: string
  createdAt?: string
  updatedAt?: string
}