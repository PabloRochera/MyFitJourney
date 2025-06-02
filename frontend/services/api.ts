const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error de conexión" }))
    throw new ApiError(error.message || "Error en la petición", response.status)
  }

  return response.json()
}

// Autenticación
export const login = async (email: string, password: string) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export const register = async (userData: any) => {
  console.log("Datos enviados al registro (api.ts):", userData);
  console.log("JSON enviado:", JSON.stringify(userData));
  try {
    return await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error("Error en registro (api.ts):", error);
    throw error;
  }
}

export const getProfile = async () => {
  return apiRequest("/auth/profile")
}

export const updateProfile = async (userData: any) => {
  return apiRequest("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

// Ejercicios
export const getExercises = async (filters?: any) => {
  const queryParams = filters ? `?${new URLSearchParams(filters)}` : ""
  return apiRequest(`/exercises${queryParams}`)
}

// Planes de entrenamiento
export const getTrainingPlans = async () => {
  return apiRequest("/training-plans")
}

export const getTrainingPlan = async (id: string) => {
  return apiRequest(`/training-plans/${id}`)
}

export const createTrainingPlan = async (planData: any) => {
  return apiRequest("/training-plans", {
    method: "POST",
    body: JSON.stringify(planData),
  })
}

// Dietas
export const getUserDiets = async (filters?: any) => {
  const queryParams = filters ? `?${new URLSearchParams(filters)}` : ""
  return apiRequest(`/diets${queryParams}`)
}

export const createDiet = async (dietData: any) => {
  return apiRequest("/diets", {
    method: "POST",
    body: JSON.stringify(dietData),
  })
}

export const toggleDiet = async (dietId: string) => {
  return apiRequest(`/diets/${dietId}/toggle`, {
    method: "PATCH",
  })
}

// Progreso
export const getUserProgress = async () => {
  return apiRequest("/progress")
}

export const addProgress = async (progressData: any) => {
  return apiRequest("/progress", {
    method: "POST",
    body: JSON.stringify(progressData),
  })
}

export const getUserStats = async () => {
  return apiRequest("/stats/dashboard")
}

export const updateProgress = async (id: string, progressData: any) => {
  return apiRequest(`/progress/${id}`, {
    method: "PUT",
    body: JSON.stringify(progressData),
  })
}

export const deleteProgress = async (id: string) => {
  return apiRequest(`/progress/${id}`, {
    method: "DELETE"
  })
}

// Rutinas de usuario
export const getUserRoutines = async () => {
  return apiRequest("/routines")
}

export const createRoutine = async (name: string) => {
  return apiRequest("/routines", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export const addExerciseToRoutine = async (routineId: string, exerciseId: string, options?: {
  sets?: number;
  reps?: number;
  time?: number;
  rest?: number;
  weight?: number;
  notes?: string;
}) => {
  return apiRequest(`/routines/${routineId}/exercises`, {
    method: "POST",
    body: JSON.stringify({ exerciseId, ...options }),
  })
}

export const removeExerciseFromRoutine = async (routineId: string, exerciseId: string) => {
  return apiRequest(`/routines/${routineId}/exercises/${exerciseId}`, {
    method: "DELETE",
  })
}

export const activateRoutine = async (routineId: string) => {
  return apiRequest(`/routines/${routineId}/activate`, {
    method: "PUT" })
}

export const deleteRoutine = async (routineId: string) => {
  return apiRequest(`/routines/${routineId}`, {
    method: "DELETE",
  })
}

export const renameRoutine = async (routineId: string, name: string) => {
  return apiRequest(`/routines/${routineId}/rename`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  })
}

export const toggleRoutine = async (routineId: string) => {
  return apiRequest(`/routines/${routineId}/toggle`, {
    method: "PUT"
  })
}
