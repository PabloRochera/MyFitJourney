const Diet = require("../models/Diet")

const dietController = {
  // Get user's diets
  getDiets: async (req, res) => {
    try {
      const { page = 1, limit = 10, isActive, vegetarian, vegan } = req.query

      // Build filter to show both template diets and user's diets
      const filter = {
        $or: [
          { isTemplate: true }, // Show all template diets
          { user: req.user._id } // Show user's personal diets
        ]
      }

      if (isActive !== undefined) filter.isActive = isActive === "true"
      if (vegetarian === "true") filter["preferences.vegetarian"] = true
      if (vegan === "true") filter["preferences.vegan"] = true

      const diets = await Diet.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)

      const total = await Diet.countDocuments(filter)

      res.json({
        success: true,
        data: diets,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      console.error("Get diets error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get diets",
        error: error.message,
      })
    }
  },

  // Get single diet
  getDiet: async (req, res) => {
    try {
      const diet = await Diet.findOne({
        _id: req.params.id,
        user: req.user._id,
      })

      if (!diet) {
        return res.status(404).json({
          success: false,
          message: "Diet not found",
        })
      }

      res.json({
        success: true,
        data: diet,
      })
    } catch (error) {
      console.error("Get diet error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get diet",
        error: error.message,
      })
    }
  },

  // Create new diet
  createDiet: async (req, res) => {
    try {
      const dietData = {
        ...req.body,
        user: req.user._id,
      }

      const diet = new Diet(dietData)
      await diet.save()

      res.status(201).json({
        success: true,
        message: "Diet created successfully",
        data: diet,
      })
    } catch (error) {
      console.error("Create diet error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to create diet",
        error: error.message,
      })
    }
  },

  // Update diet
  updateDiet: async (req, res) => {
    try {
      const diet = await Diet.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
        new: true,
        runValidators: true,
      })

      if (!diet) {
        return res.status(404).json({
          success: false,
          message: "Diet not found",
        })
      }

      res.json({
        success: true,
        message: "Diet updated successfully",
        data: diet,
      })
    } catch (error) {
      console.error("Update diet error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update diet",
        error: error.message,
      })
    }
  },

  // Delete diet
  deleteDiet: async (req, res) => {
    try {
      const diet = await Diet.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      })

      if (!diet) {
        return res.status(404).json({
          success: false,
          message: "Diet not found",
        })
      }

      res.json({
        success: true,
        message: "Diet deleted successfully",
      })
    } catch (error) {
      console.error("Delete diet error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to delete diet",
        error: error.message,
      })
    }
  },

  // Toggle diet active status
  toggleDiet: async (req, res) => {
    try {
      // Find the diet by ID (either template or user's diet)
      const diet = await Diet.findOne({
        _id: req.params.id,
        $or: [
          { isTemplate: true },
          { user: req.user._id }
        ]
      })

      if (!diet) {
        return res.status(404).json({
          success: false,
          message: "Diet not found",
        })
      }

      // If the diet is already active, deactivate it
      if (diet.isActive) {
        diet.isActive = false
        diet.startDate = undefined
        await diet.save()
      } else {
        // Desactivar TODOS los demás planes activos (plantillas y personales)
        await Diet.updateMany(
          { _id: { $ne: diet._id }, isActive: true },
          { isActive: false, startDate: undefined }
        )
        // Activar este plan
        diet.isActive = true
        diet.startDate = new Date()
        await diet.save()
      }

      res.json({
        success: true,
        message: diet.isActive ? "Diet activated successfully" : "Diet deactivated successfully",
        data: diet,
      })
    } catch (error) {
      console.error("Toggle diet error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to toggle diet status",
        error: error.message,
      })
    }
  },

  // Get recommended diets
  getRecommendedDiets: async (req, res) => {
    try {
      const user = req.user

      // Si el usuario no tiene los datos necesarios, devolver dietas plantilla
      if (!user.weight || !user.height || !user.activityLevel) {
        const recommendedDiets = await Diet.find({ isTemplate: true })
          .limit(5)
          .sort({ createdAt: -1 })

        return res.json({
          success: true,
          data: recommendedDiets,
          message: "Recommended template diets",
        })
      }

      // Calculate recommended calories
      const calories = calculateBMR(user)

      // Build recommendation criteria
      const filter = {
        isTemplate: true,
        calories: { $gte: calories - 200, $lte: calories + 200 },
      }

      // Add preference filters
      if (user.preferences && user.preferences.vegetarian) {
        filter["preferences.vegetarian"] = true
      }

      const recommendedDiets = await Diet.find(filter).limit(5).sort({ createdAt: -1 })

      res.json({
        success: true,
        data: recommendedDiets,
        recommendedCalories: calories,
        message: "Recommended diets based on your profile",
      })
    } catch (error) {
      console.error("Get recommended diets error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get recommended diets",
        error: error.message,
      })
    }
  },

  // Calculate daily calories
  calculateDailyCalories: async (req, res) => {
    try {
      const user = req.user
      const calories = calculateBMR(user)

      res.json({
        success: true,
        data: {
          bmr: Math.round(calories * 0.8), // Base Metabolic Rate
          maintenance: Math.round(calories), // Maintenance calories
          weightLoss: Math.round(calories * 0.85), // For weight loss
          weightGain: Math.round(calories * 1.15), // For weight gain
        },
        message: "Daily calorie recommendations calculated",
      })
    } catch (error) {
      console.error("Calculate calories error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to calculate daily calories",
        error: error.message,
      })
    }
  },
}

// Helper function to calculate BMR and daily calories
function calculateBMR(user) {
  // Mifflin-St Jeor Equation (assuming male for simplicity)
  // For more accuracy, you'd need gender in the user model
  const bmr = 10 * user.weight + 6.25 * user.height - 5 * 25 + 5 // Assuming age 25

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very-active": 1.9,
  }

  const multiplier = activityMultipliers[user.activityLevel] || 1.2
  return bmr * multiplier
}

module.exports = dietController
