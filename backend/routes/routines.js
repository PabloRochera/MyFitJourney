const express = require("express")
const router = express.Router()
const routineController = require("../controllers/routineController")
const { authenticateToken } = require("../middleware/auth")

// Obtener todas las rutinas del usuario
router.get("/", authenticateToken, routineController.getUserRoutines)

// Crear nueva rutina
router.post("/", authenticateToken, routineController.createRoutine)

// Actualizar una rutina
router.put("/:id", authenticateToken, routineController.updateRoutine)

// Eliminar una rutina
router.delete("/:id", authenticateToken, routineController.deleteRoutine)

// Activar/Desactivar rutina
router.put("/:id/toggle", authenticateToken, routineController.toggleRoutine)

// Añadir ejercicio a una rutina
router.post("/:id/exercises", authenticateToken, routineController.addExerciseToRoutine)

// Quitar ejercicio de una rutina
router.delete("/:id/exercises/:exerciseId", authenticateToken, routineController.removeExerciseFromRoutine)

// Renombrar una rutina
router.put("/:id/rename", authenticateToken, routineController.renameRoutine)

module.exports = router 