const Progress = require("../models/Progress")

const progressController = {
  // Get user's progress entries
  getProgress: async (req, res) => {
    try {
      const { page = 1, limit = 20, startDate, endDate, sortBy = "date", sortOrder = "desc" } = req.query

      const filter = { user: req.user._id }

      // Date range filter
      if (startDate || endDate) {
        filter.date = {}
        if (startDate) filter.date.$gte = new Date(startDate)
        if (endDate) filter.date.$lte = new Date(endDate)
      }

      // Build sort object
      const sort = {}
      sort[sortBy] = sortOrder === "desc" ? -1 : 1

      const progressEntries = await Progress.find(filter)
        .populate("workoutLog.exercise", "title category")
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)

      const total = await Progress.countDocuments(filter)

      res.json({
        success: true,
        data: progressEntries,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      console.error("Get progress error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get progress",
        error: error.message,
      })
    }
  },

  // Get single progress entry
  getProgressEntry: async (req, res) => {
    try {
      const progressEntry = await Progress.findOne({
        _id: req.params.id,
        user: req.user._id,
      }).populate("workoutLog.exercise", "title category level")

      if (!progressEntry) {
        return res.status(404).json({
          success: false,
          message: "Progress entry not found",
        })
      }

      res.json({
        success: true,
        data: progressEntry,
      })
    } catch (error) {
      console.error("Get progress entry error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get progress entry",
        error: error.message,
      })
    }
  },

  // Create new progress entry
  createProgress: async (req, res) => {
    try {
      const progressData = {
        ...req.body,
        user: req.user._id,
      }

      // Check if entry for this date already exists
      const existingEntry = await Progress.findOne({
        user: req.user._id,
        date: progressData.date || new Date().toISOString().split("T")[0],
      })

      if (existingEntry) {
        return res.status(400).json({
          success: false,
          message: "Progress entry for this date already exists",
        })
      }

      const progress = new Progress(progressData)
      await progress.save()

      res.status(201).json({
        success: true,
        message: "Progress entry created successfully",
        data: progress,
      })
    } catch (error) {
      console.error("Create progress error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to create progress entry",
        error: error.message,
      })
    }
  },

  // Update progress entry
  updateProgress: async (req, res) => {
    try {
      const progress = await Progress.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
        new: true,
        runValidators: true,
      })

      if (!progress) {
        return res.status(404).json({
          success: false,
          message: "Progress entry not found",
        })
      }

      res.json({
        success: true,
        message: "Progress entry updated successfully",
        data: progress,
      })
    } catch (error) {
      console.error("Update progress error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update progress entry",
        error: error.message,
      })
    }
  },

  // Delete progress entry
  deleteProgress: async (req, res) => {
    try {
      const progress = await Progress.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      })

      if (!progress) {
        return res.status(404).json({
          success: false,
          message: "Progress entry not found",
        })
      }

      res.json({
        success: true,
        message: "Progress entry deleted successfully",
      })
    } catch (error) {
      console.error("Delete progress error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to delete progress entry",
        error: error.message,
      })
    }
  },

  // Get progress analytics
  getProgressAnalytics: async (req, res) => {
    try {
      const { period = "30" } = req.query // days
      const startDate = new Date(Date.now() - Number.parseInt(period) * 24 * 60 * 60 * 1000)

      const progressEntries = await Progress.find({
        user: req.user._id,
        date: { $gte: startDate },
      }).sort({ date: 1 })

      if (progressEntries.length === 0) {
        return res.json({
          success: true,
          data: {
            totalEntries: 0,
            weightChange: 0,
            averageWorkouts: 0,
            averageCalories: 0,
            trend: "stable",
          },
        })
      }

      // Calculate analytics
      const firstEntry = progressEntries[0]
      const lastEntry = progressEntries[progressEntries.length - 1]
      const weightChange = lastEntry.weight - firstEntry.weight

      const totalWorkouts = progressEntries.reduce((sum, entry) => sum + (entry.completedWorkouts || 0), 0)
      const totalCalories = progressEntries.reduce((sum, entry) => sum + (entry.nutrition?.caloriesConsumed || 0), 0)

      const averageWorkouts = totalWorkouts / progressEntries.length
      const averageCalories = totalCalories / progressEntries.length

      // Determine trend
      let trend = "stable"
      if (weightChange > 1) trend = "gaining"
      else if (weightChange < -1) trend = "losing"

      res.json({
        success: true,
        data: {
          totalEntries: progressEntries.length,
          weightChange: Number.parseFloat(weightChange.toFixed(1)),
          averageWorkouts: Number.parseFloat(averageWorkouts.toFixed(1)),
          averageCalories: Math.round(averageCalories),
          trend,
          period: Number.parseInt(period),
          startWeight: firstEntry.weight,
          currentWeight: lastEntry.weight,
        },
      })
    } catch (error) {
      console.error("Get progress analytics error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get progress analytics",
        error: error.message,
      })
    }
  },

  // Get weight trend
  getWeightTrend: async (req, res) => {
    try {
      const { period = "90" } = req.query // days
      const startDate = new Date(Date.now() - Number.parseInt(period) * 24 * 60 * 60 * 1000)

      const progressEntries = await Progress.find({
        user: req.user._id,
        date: { $gte: startDate },
      })
        .select("date weight")
        .sort({ date: 1 })

      const weightData = progressEntries.map((entry) => ({
        date: entry.date.toISOString().split("T")[0],
        weight: entry.weight,
      }))

      res.json({
        success: true,
        data: weightData,
        period: Number.parseInt(period),
        totalEntries: weightData.length,
      })
    } catch (error) {
      console.error("Get weight trend error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get weight trend",
        error: error.message,
      })
    }
  },
}

module.exports = progressController
