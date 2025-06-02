const express = require("express")
const { validateProgress } = require("../middleware/validation")
const progressController = require("../controllers/progressController")

const router = express.Router()

// Get user's progress entries
router.get("/", progressController.getProgress)

// Get single progress entry
router.get("/:id", progressController.getProgressEntry)

// Create new progress entry
router.post("/", validateProgress, progressController.createProgress)

// Update progress entry
router.put("/:id", progressController.updateProgress)

// Delete progress entry
router.delete("/:id", progressController.deleteProgress)

// Get progress analytics
router.get("/analytics/summary", progressController.getProgressAnalytics)

// Get weight trend
router.get("/analytics/weight-trend", progressController.getWeightTrend)

module.exports = router
