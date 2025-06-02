const express = require("express")
const exerciseController = require("../controllers/exerciseController")

const router = express.Router()

// Get all exercises with filtering
router.get("/", exerciseController.getExercises)

// Get single exercise
router.get("/:id", exerciseController.getExercise)

// Create new exercise (admin only in production)
router.post("/", exerciseController.createExercise)

// Update exercise
router.put("/:id", exerciseController.updateExercise)

// Delete exercise
router.delete("/:id", exerciseController.deleteExercise)

// Get exercises by category
router.get("/category/:category", exerciseController.getExercisesByCategory)

// Get exercises by muscle group
router.get("/muscle/:muscleGroup", exerciseController.getExercisesByMuscleGroup)

// Search exercises
router.get("/search/:query", exerciseController.searchExercises)

module.exports = router
