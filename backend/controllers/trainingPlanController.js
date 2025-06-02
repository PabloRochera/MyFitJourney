const TrainingPlan = require("../models/TrainingPlan")
const Exercise = require("../models/Exercise")

const trainingPlanController = {
  // Get user's training plans
  getTrainingPlans: async (req, res) => {
    try {
      const { page = 1, limit = 10, isActive, goal, level } = req.query

      const filter = { user: req.user._id }
      if (isActive !== undefined) filter.isActive = isActive === "true"
      if (goal) filter.goal = goal
      if (level) filter.level = level

      const trainingPlans = await TrainingPlan.find(filter)
        .populate("days.exercises.exercise", "title category level duration")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)

      const total = await TrainingPlan.countDocuments(filter)

      res.json({
        success: true,
        data: trainingPlans,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      console.error("Get training plans error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get training plans",
        error: error.message,
      })
    }
  },

  // Get single training plan
  getTrainingPlan: async (req, res) => {
    try {
      const trainingPlan = await TrainingPlan.findOne({
        _id: req.params.id,
        user: req.user._id,
      }).populate("days.exercises.exercise", "title category level duration muscleGroups equipment")

      if (!trainingPlan) {
        return res.status(404).json({
          success: false,
          message: "Training plan not found",
        })
      }

      res.json({
        success: true,
        data: trainingPlan,
      })
    } catch (error) {
      console.error("Get training plan error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get training plan",
        error: error.message,
      })
    }
  },

  // Create new training plan
  createTrainingPlan: async (req, res) => {
    try {
      const trainingPlanData = {
        ...req.body,
        user: req.user._id,
      }

      // Validate exercises exist
      if (trainingPlanData.days && trainingPlanData.days.length > 0) {
        for (const day of trainingPlanData.days) {
          if (day.exercises && day.exercises.length > 0) {
            for (const exercise of day.exercises) {
              const exerciseExists = await Exercise.findById(exercise.exercise)
              if (!exerciseExists) {
                return res.status(400).json({
                  success: false,
                  message: `Exercise with ID ${exercise.exercise} not found`,
                })
              }
            }
          }
        }
      }

      const trainingPlan = new TrainingPlan(trainingPlanData)
      await trainingPlan.save()

      // Populate the created plan
      await trainingPlan.populate("days.exercises.exercise", "title category level duration")

      res.status(201).json({
        success: true,
        message: "Training plan created successfully",
        data: trainingPlan,
      })
    } catch (error) {
      console.error("Create training plan error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to create training plan",
        error: error.message,
      })
    }
  },

  // Update training plan
  updateTrainingPlan: async (req, res) => {
    try {
      const trainingPlan = await TrainingPlan.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
        new: true,
        runValidators: true,
      }).populate("days.exercises.exercise", "title category level duration")

      if (!trainingPlan) {
        return res.status(404).json({
          success: false,
          message: "Training plan not found",
        })
      }

      res.json({
        success: true,
        message: "Training plan updated successfully",
        data: trainingPlan,
      })
    } catch (error) {
      console.error("Update training plan error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update training plan",
        error: error.message,
      })
    }
  },

  // Delete training plan
  deleteTrainingPlan: async (req, res) => {
    try {
      const trainingPlan = await TrainingPlan.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      })

      if (!trainingPlan) {
        return res.status(404).json({
          success: false,
          message: "Training plan not found",
        })
      }

      res.json({
        success: true,
        message: "Training plan deleted successfully",
      })
    } catch (error) {
      console.error("Delete training plan error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to delete training plan",
        error: error.message,
      })
    }
  },

  // Activate training plan
  activateTrainingPlan: async (req, res) => {
    try {
      // Deactivate all other plans for this user
      await TrainingPlan.updateMany({ user: req.user._id }, { isActive: false })

      // Activate the selected plan
      const trainingPlan = await TrainingPlan.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        {
          isActive: true,
          startDate: new Date(),
          endDate: new Date(Date.now() + req.body.duration * 7 * 24 * 60 * 60 * 1000), // duration in weeks
        },
        { new: true },
      ).populate("days.exercises.exercise", "title category level duration")

      if (!trainingPlan) {
        return res.status(404).json({
          success: false,
          message: "Training plan not found",
        })
      }

      res.json({
        success: true,
        message: "Training plan activated successfully",
        data: trainingPlan,
      })
    } catch (error) {
      console.error("Activate training plan error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to activate training plan",
        error: error.message,
      })
    }
  },

  // Complete workout
  completeWorkout: async (req, res) => {
    try {
      const { dayIndex, exercises } = req.body

      const trainingPlan = await TrainingPlan.findOne({
        _id: req.params.id,
        user: req.user._id,
      })

      if (!trainingPlan) {
        return res.status(404).json({
          success: false,
          message: "Training plan not found",
        })
      }

      // Increment completed workouts
      trainingPlan.completedWorkouts += 1
      await trainingPlan.save()

      // Here you could also log the workout details to Progress model

      res.json({
        success: true,
        message: "Workout completed successfully",
        data: {
          completedWorkouts: trainingPlan.completedWorkouts,
          totalWorkouts: trainingPlan.totalWorkouts,
          completionPercentage: trainingPlan.completionPercentage,
        },
      })
    } catch (error) {
      console.error("Complete workout error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to complete workout",
        error: error.message,
      })
    }
  },

  // Get recommended plans based on user profile
  getRecommendedPlans: async (req, res) => {
    try {
      const user = req.user

      // Build recommendation criteria based on user profile
      const filter = {
        isTemplate: true,
        level: user.experience,
        goal: user.goal,
      }

      const recommendedPlans = await TrainingPlan.find(filter)
        .populate("days.exercises.exercise", "title category level duration")
        .limit(5)
        .sort({ createdAt: -1 })

      res.json({
        success: true,
        data: recommendedPlans,
        message: `Recommended plans for ${user.goal} goal and ${user.experience} level`,
      })
    } catch (error) {
      console.error("Get recommended plans error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get recommended plans",
        error: error.message,
      })
    }
  },
}

module.exports = trainingPlanController
