const express = require("express")
const { validateDiet } = require("../middleware/validation")
const dietController = require("../controllers/dietController")

const router = express.Router()

// Get user's diets
router.get("/", dietController.getDiets)

// Get single diet
router.get("/:id", dietController.getDiet)

// Create new diet
router.post("/", validateDiet, dietController.createDiet)

// Update diet
router.put("/:id", dietController.updateDiet)

// Delete diet
router.delete("/:id", dietController.deleteDiet)

// Toggle diet active status
router.patch("/:id/toggle", dietController.toggleDiet)

// Get recommended diets
router.get("/recommendations/for-user", dietController.getRecommendedDiets)

// Calculate daily calories
router.post("/calculate-calories", dietController.calculateDailyCalories)

module.exports = router
