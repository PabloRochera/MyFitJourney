const express = require("express")
const statsController = require("../controllers/statsController")

const router = express.Router()

// Get user dashboard stats
router.get("/dashboard", statsController.getDashboardStats)

// Get workout stats
router.get("/workouts", statsController.getWorkoutStats)

// Get nutrition stats
router.get("/nutrition", statsController.getNutritionStats)

// Get achievement stats
router.get("/achievements", statsController.getAchievements)

module.exports = router
