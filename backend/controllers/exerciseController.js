const Exercise = require("../models/Exercise")

const exerciseController = {
  // Get all exercises with filtering and pagination
  getExercises: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        level,
        muscleGroup,
        equipment,
        search,
        sortBy = "title",
        sortOrder = "asc",
      } = req.query

      // Build filter object
      const filter = { isActive: true }

      if (category) filter.category = category
      if (level) filter.level = level
      if (muscleGroup) filter.muscleGroups = { $in: [muscleGroup] }
      if (equipment) filter.equipment = { $in: [equipment] }
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ]
      }

      // Build sort object
      const sort = {}
      sort[sortBy] = sortOrder === "desc" ? -1 : 1

      // Execute query with pagination
      const exercises = await Exercise.find(filter)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate("createdBy", "name")

      // Get total count for pagination
      const total = await Exercise.countDocuments(filter)

      res.json({
        success: true,
        data: exercises,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      console.error("Get exercises error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get exercises",
        error: error.message,
      })
    }
  },

  // Get single exercise
  getExercise: async (req, res) => {
    try {
      const exercise = await Exercise.findById(req.params.id).populate("createdBy", "name")

      if (!exercise || !exercise.isActive) {
        return res.status(404).json({
          success: false,
          message: "Exercise not found",
        })
      }

      res.json({
        success: true,
        data: exercise,
      })
    } catch (error) {
      console.error("Get exercise error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get exercise",
        error: error.message,
      })
    }
  },

  // Create new exercise
  createExercise: async (req, res) => {
    try {
      const exerciseData = {
        ...req.body,
        createdBy: req.user._id,
      }

      const exercise = new Exercise(exerciseData)
      await exercise.save()

      res.status(201).json({
        success: true,
        message: "Exercise created successfully",
        data: exercise,
      })
    } catch (error) {
      console.error("Create exercise error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to create exercise",
        error: error.message,
      })
    }
  },

  // Update exercise
  updateExercise: async (req, res) => {
    try {
      const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })

      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: "Exercise not found",
        })
      }

      res.json({
        success: true,
        message: "Exercise updated successfully",
        data: exercise,
      })
    } catch (error) {
      console.error("Update exercise error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update exercise",
        error: error.message,
      })
    }
  },

  // Delete exercise (soft delete)
  deleteExercise: async (req, res) => {
    try {
      const exercise = await Exercise.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

      if (!exercise) {
        return res.status(404).json({
          success: false,
          message: "Exercise not found",
        })
      }

      res.json({
        success: true,
        message: "Exercise deleted successfully",
      })
    } catch (error) {
      console.error("Delete exercise error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to delete exercise",
        error: error.message,
      })
    }
  },

  // Get exercises by category
  getExercisesByCategory: async (req, res) => {
    try {
      const { category } = req.params
      const { limit = 20 } = req.query

      const exercises = await Exercise.find({
        category,
        isActive: true,
      })
        .limit(Number.parseInt(limit))
        .sort({ title: 1 })

      res.json({
        success: true,
        data: exercises,
        count: exercises.length,
      })
    } catch (error) {
      console.error("Get exercises by category error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get exercises by category",
        error: error.message,
      })
    }
  },

  // Get exercises by muscle group
  getExercisesByMuscleGroup: async (req, res) => {
    try {
      const { muscleGroup } = req.params
      const { limit = 20 } = req.query

      const exercises = await Exercise.find({
        muscleGroups: { $in: [muscleGroup] },
        isActive: true,
      })
        .limit(Number.parseInt(limit))
        .sort({ title: 1 })

      res.json({
        success: true,
        data: exercises,
        count: exercises.length,
      })
    } catch (error) {
      console.error("Get exercises by muscle group error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get exercises by muscle group",
        error: error.message,
      })
    }
  },

  // Search exercises
  searchExercises: async (req, res) => {
    try {
      const { query } = req.params
      const { limit = 20 } = req.query

      const exercises = await Exercise.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { title: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
              { tags: { $in: [new RegExp(query, "i")] } },
              { muscleGroups: { $in: [new RegExp(query, "i")] } },
            ],
          },
        ],
      })
        .limit(Number.parseInt(limit))
        .sort({ title: 1 })

      res.json({
        success: true,
        data: exercises,
        count: exercises.length,
        query,
      })
    } catch (error) {
      console.error("Search exercises error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to search exercises",
        error: error.message,
      })
    }
  },
}

module.exports = exerciseController
