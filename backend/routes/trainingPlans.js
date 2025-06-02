const express = require("express")
const trainingPlanController = require("../controllers/trainingPlanController")

const router = express.Router()

// Get user's training plans
router.get("/", trainingPlanController.getTrainingPlans)

// Get single training plan
router.get("/:id", trainingPlanController.getTrainingPlan)

// Create new training plan
router.post("/", trainingPlanController.createTrainingPlan)

// Update training plan
router.put("/:id", trainingPlanController.updateTrainingPlan)

// Delete training plan
router.delete("/:id", trainingPlanController.deleteTrainingPlan)

// Activate training plan
router.patch("/:id/activate", trainingPlanController.activateTrainingPlan)

// Complete workout
router.post("/:id/complete-workout", trainingPlanController.completeWorkout)

// Get recommended plans
router.get("/recommendations/for-user", trainingPlanController.getRecommendedPlans)

module.exports = router
