const Routine = require("../models/Routine")
const Exercise = require("../models/Exercise")

const routineController = {
  // Obtener todas las rutinas del usuario
  getUserRoutines: async (req, res) => {
    try {
      const routines = await Routine.find({ user: req.user._id }).populate("exercises")
      res.json({ success: true, data: routines })
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener rutinas", error: error.message })
    }
  },

  // Crear nueva rutina
  createRoutine: async (req, res) => {
    try {
      const { name } = req.body
      const routine = new Routine({
        user: req.user._id,
        name,
        exercises: [],
        isActive: false,
      })
      await routine.save()
      res.status(201).json({ success: true, data: routine })
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al crear rutina", error: error.message })
    }
  },

  // Actualizar una rutina
  updateRoutine: async (req, res) => {
    try {
      const { id } = req.params
      const { name } = req.body
      const routine = await Routine.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { name },
        { new: true }
      )
      if (!routine) return res.status(404).json({ success: false, message: "Rutina no encontrada" })
      res.json({ success: true, data: routine })
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al actualizar rutina", error: error.message })
    }
  },

  // Eliminar una rutina
  deleteRoutine: async (req, res) => {
    try {
      const { id } = req.params
      const routine = await Routine.findOneAndDelete({ _id: id, user: req.user._id })
      if (!routine) return res.status(404).json({ success: false, message: "Rutina no encontrada" })
      // No afecta a otras rutinas ni a los ejercicios globales
      res.json({ success: true, message: "Rutina eliminada" })
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al eliminar rutina", error: error.message })
    }
  },

  // Activar/Desactivar una rutina
  toggleRoutine: async (req, res) => {
    try {
      const { id } = req.params
      const routine = await Routine.findOne({ _id: id, user: req.user._id })
      
      if (!routine) {
        return res.status(404).json({ success: false, message: "Rutina no encontrada" })
      }

      // Si la rutina está activa, la desactivamos
      if (routine.isActive) {
        routine.isActive = false
        await routine.save()
        return res.json({ success: true, data: routine, message: "Rutina desactivada" })
      }

      // Si la rutina no está activa, desactivamos todas las demás y activamos esta
      await Routine.updateMany({ user: req.user._id }, { isActive: false })
      routine.isActive = true
      await routine.save()
      
      res.json({ success: true, data: routine, message: "Rutina activada" })
    } catch (error) {
      console.error("Error al cambiar estado de la rutina:", error)
      res.status(500).json({ success: false, message: "Error al cambiar estado de la rutina", error: error.message })
    }
  },

  // Añadir ejercicio a una rutina
  addExerciseToRoutine: async (req, res) => {
    try {
      const routineId = req.params.id
      const { exerciseId, sets, reps, time, rest, weight, notes } = req.body
      
      // Buscar la rutina
      const routine = await Routine.findOne({ _id: routineId, user: req.user._id })
      if (!routine) {
        return res.status(404).json({ success: false, message: "Rutina no encontrada" })
      }

      // Verificar límite de ejercicios
      if (routine.exercises.length >= 10) {
        return res.status(400).json({ success: false, message: "No puedes añadir más de 10 ejercicios" })
      }

      // Verificar si el ejercicio ya existe en la rutina
      if (routine.exercises.some(e => e.exerciseId.toString() === exerciseId)) {
        return res.status(400).json({ success: false, message: "El ejercicio ya está en la rutina" })
      }

      // Buscar el ejercicio global
      const exercise = await Exercise.findById(exerciseId)
      if (!exercise) {
        return res.status(404).json({ success: false, message: "Ejercicio no encontrado" })
      }

      // Crear snapshot del ejercicio
      const exerciseSnapshot = {
        exerciseId: exercise._id,
        title: exercise.title,
        description: exercise.description,
        instructions: exercise.instructions,
        category: exercise.category,
        level: exercise.level,
        muscleGroups: exercise.muscleGroups,
        equipment: exercise.equipment,
        duration: exercise.duration,
        intensity: exercise.intensity,
        calories: exercise.calories,
        image: exercise.image,
        videoUrl: exercise.videoUrl,
        tags: exercise.tags,
        sets: sets || 3,
        reps: reps || (exercise.category === "cardio" ? null : 12),
        time: time || (exercise.category === "cardio" ? 300 : null),
        rest: rest || 60,
        weight: weight || (exercise.category === "strength" ? 10 : null),
        notes: notes || "",
        order: routine.exercises.length + 1
      }

      // Añadir el ejercicio a la rutina
      routine.exercises.push(exerciseSnapshot)
      await routine.save()

      res.json({ success: true, data: routine })
    } catch (error) {
      console.error("Error al añadir ejercicio:", error)
      res.status(500).json({ success: false, message: "Error al añadir ejercicio", error: error.message })
    }
  },

  // Quitar ejercicio de una rutina
  removeExerciseFromRoutine: async (req, res) => {
    try {
      const routineId = req.params.id
      const exerciseId = req.params.exerciseId
      const routine = await Routine.findOne({ _id: routineId, user: req.user._id })
      if (!routine) return res.status(404).json({ success: false, message: "Rutina no encontrada" })
      routine.exercises = routine.exercises.filter(eId => eId.toString() !== exerciseId)
      await routine.save()
      res.json({ success: true, data: routine })
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al quitar ejercicio", error: error.message })
    }
  },

  // Renombrar una rutina
  renameRoutine: async (req, res) => {
    try {
      const { id } = req.params
      const { name } = req.body
      const routine = await Routine.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { name },
        { new: true }
      )
      if (!routine) return res.status(404).json({ success: false, message: "Rutina no encontrada" })
      res.json({ success: true, data: routine })
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al renombrar rutina", error: error.message })
    }
  },
}

module.exports = routineController 