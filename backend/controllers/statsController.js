const Progress = require("../models/Progress")
const TrainingPlan = require("../models/TrainingPlan")
const Diet = require("../models/Diet")

const statsController = {
  // Get dashboard stats
  getDashboardStats: async (req, res) => {
    try {
      const userId = req.user._id
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      // Get recent progress entries
      const recentProgress = await Progress.find({
        user: userId,
        date: { $gte: thirtyDaysAgo },
      }).sort({ date: -1 })

      // Calculate stats
      const totalWorkouts = recentProgress.reduce((sum, entry) => sum + (entry.completedWorkouts || 0), 0)

      const weeklyCalories = await Progress.find({
        user: userId,
        date: { $gte: sevenDaysAgo },
      })

      const totalCalories = weeklyCalories.reduce((sum, entry) => sum + (entry.nutrition?.caloriesConsumed || 0), 0)

      const activeDays = recentProgress.length

      // Calculate current streak
      let currentStreak = 0
      const sortedProgress = recentProgress.sort((a, b) => new Date(b.date) - new Date(a.date))

      for (let i = 0; i < sortedProgress.length; i++) {
        const entry = sortedProgress[i]
        const expectedDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const entryDate = new Date(entry.date)

        if (entryDate.toDateString() === expectedDate.toDateString() && entry.completedWorkouts > 0) {
          currentStreak++
        } else {
          break
        }
      }

      res.json({
        success: true,
        data: {
          completedWorkouts: totalWorkouts,
          totalCalories,
          activeDays,
          currentStreak,
          period: "30 days",
        },
      })
    } catch (error) {
      console.error("Get dashboard stats error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get dashboard stats",
        error: error.message,
      })
    }
  },

  // Get workout stats
  getWorkoutStats: async (req, res) => {
    try {
      const userId = req.user._id
      const { period = "30" } = req.query
      const startDate = new Date(Date.now() - Number.parseInt(period) * 24 * 60 * 60 * 1000)

      // Get active training plan
      const activeTrainingPlan = await TrainingPlan.findOne({
        user: userId,
        isActive: true,
      })

      // Get workout data from progress entries
      const progressEntries = await Progress.find({
        user: userId,
        date: { $gte: startDate },
      }).populate("workoutLog.exercise", "title category")

      const totalWorkouts = progressEntries.reduce((sum, entry) => sum + (entry.completedWorkouts || 0), 0)

      // Calculate workout frequency
      const workoutDays = progressEntries.filter((entry) => entry.completedWorkouts > 0).length
      const frequency = workoutDays / Number.parseInt(period)

      // Get exercise categories distribution
      const categoryStats = {}
      progressEntries.forEach((entry) => {
        entry.workoutLog.forEach((workout) => {
          if (workout.exercise && workout.exercise.category) {
            const category = workout.exercise.category
            categoryStats[category] = (categoryStats[category] || 0) + 1
          }
        })
      })

      res.json({
        success: true,
        data: {
          totalWorkouts,
          workoutDays,
          frequency: Number.parseFloat(frequency.toFixed(2)),
          activeTrainingPlan: activeTrainingPlan
            ? {
                title: activeTrainingPlan.title,
                completionPercentage: activeTrainingPlan.completionPercentage,
                daysPerWeek: activeTrainingPlan.daysPerWeek,
              }
            : null,
          categoryStats,
          period: Number.parseInt(period),
        },
      })
    } catch (error) {
      console.error("Get workout stats error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get workout stats",
        error: error.message,
      })
    }
  },

  // Get nutrition stats
  getNutritionStats: async (req, res) => {
    try {
      const userId = req.user._id
      const { period = "30" } = req.query
      const startDate = new Date(Date.now() - Number.parseInt(period) * 24 * 60 * 60 * 1000)

      // Get active diet
      const activeDiet = await Diet.findOne({
        user: userId,
        isActive: true,
      })

      // Get nutrition data from progress entries
      const progressEntries = await Progress.find({
        user: userId,
        date: { $gte: startDate },
        "nutrition.caloriesConsumed": { $exists: true },
      })

      if (progressEntries.length === 0) {
        return res.json({
          success: true,
          data: {
            averageCalories: 0,
            totalDays: 0,
            adherenceScore: 0,
            activeDiet: activeDiet
              ? {
                  title: activeDiet.title,
                  targetCalories: activeDiet.calories,
                  macros: activeDiet.macros,
                }
              : null,
          },
        })
      }

      const totalCalories = progressEntries.reduce((sum, entry) => sum + (entry.nutrition?.caloriesConsumed || 0), 0)
      const averageCalories = totalCalories / progressEntries.length

      // Calculate adherence score if there's an active diet
      let adherenceScore = 0
      if (activeDiet) {
        const targetCalories = activeDiet.calories
        const adherentDays = progressEntries.filter((entry) => {
          const consumed = entry.nutrition?.caloriesConsumed || 0
          return Math.abs(consumed - targetCalories) <= targetCalories * 0.1 // Within 10%
        }).length

        adherenceScore = (adherentDays / progressEntries.length) * 100
      }

      res.json({
        success: true,
        data: {
          averageCalories: Math.round(averageCalories),
          totalDays: progressEntries.length,
          adherenceScore: Math.round(adherenceScore),
          activeDiet: activeDiet
            ? {
                title: activeDiet.title,
                targetCalories: activeDiet.calories,
                macros: activeDiet.macros,
              }
            : null,
          period: Number.parseInt(period),
        },
      })
    } catch (error) {
      console.error("Get nutrition stats error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get nutrition stats",
        error: error.message,
      })
    }
  },

  // Get achievements
  getAchievements: async (req, res) => {
    try {
      const userId = req.user._id

      // Get all progress entries
      const allProgress = await Progress.find({ user: userId }).sort({ date: 1 })

      if (allProgress.length === 0) {
        return res.json({
          success: true,
          data: {
            achievements: [],
            totalAchievements: 0,
          },
        })
      }

      const achievements = []

      // First workout achievement
      if (allProgress.some((entry) => entry.completedWorkouts > 0)) {
        achievements.push({
          id: "first_workout",
          title: "First Workout",
          description: "Completed your first workout",
          icon: "🏋️",
          unlockedAt: allProgress.find((entry) => entry.completedWorkouts > 0).date,
        })
      }

      // Weight loss achievements
      const firstWeight = allProgress[0].weight
      const currentWeight = allProgress[allProgress.length - 1].weight
      const weightLoss = firstWeight - currentWeight

      if (weightLoss >= 1) {
        achievements.push({
          id: "weight_loss_1kg",
          title: "First Kilogram",
          description: "Lost your first kilogram",
          icon: "📉",
          unlockedAt: new Date(),
        })
      }

      if (weightLoss >= 5) {
        achievements.push({
          id: "weight_loss_5kg",
          title: "Five Kilograms Down",
          description: "Lost 5 kilograms",
          icon: "🎯",
          unlockedAt: new Date(),
        })
      }

      // Consistency achievements
      const totalWorkouts = allProgress.reduce((sum, entry) => sum + (entry.completedWorkouts || 0), 0)

      if (totalWorkouts >= 10) {
        achievements.push({
          id: "workouts_10",
          title: "Dedicated",
          description: "Completed 10 workouts",
          icon: "💪",
          unlockedAt: new Date(),
        })
      }

      if (totalWorkouts >= 50) {
        achievements.push({
          id: "workouts_50",
          title: "Committed",
          description: "Completed 50 workouts",
          icon: "🔥",
          unlockedAt: new Date(),
        })
      }

      // Progress tracking achievement
      if (allProgress.length >= 7) {
        achievements.push({
          id: "tracking_week",
          title: "Tracker",
          description: "Tracked progress for a week",
          icon: "📊",
          unlockedAt: allProgress[6].date,
        })
      }

      res.json({
        success: true,
        data: {
          achievements: achievements.sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt)),
          totalAchievements: achievements.length,
          stats: {
            totalWorkouts,
            weightChange: Number.parseFloat((currentWeight - firstWeight).toFixed(1)),
            daysTracked: allProgress.length,
          },
        },
      })
    } catch (error) {
      console.error("Get achievements error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get achievements",
        error: error.message,
      })
    }
  },
}

module.exports = statsController
