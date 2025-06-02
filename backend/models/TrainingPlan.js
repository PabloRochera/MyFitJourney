const mongoose = require("mongoose")

const trainingExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  sets: {
    type: Number,
    required: [true, "Number of sets is required"],
    min: [1, "Sets must be at least 1"],
    max: [10, "Sets cannot exceed 10"],
  },
  reps: {
    type: Number,
    min: [1, "Reps must be at least 1"],
    max: [100, "Reps cannot exceed 100"],
  },
  duration: {
    type: Number, // in seconds
    min: [10, "Duration must be at least 10 seconds"],
  },
  rest: {
    type: Number, // in seconds
    default: 60,
    min: [0, "Rest cannot be negative"],
    max: [600, "Rest cannot exceed 10 minutes"],
  },
  weight: {
    type: Number, // in kg
    min: [0, "Weight cannot be negative"],
  },
  notes: {
    type: String,
    maxlength: [200, "Notes cannot exceed 200 characters"],
  },
})

const trainingDaySchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: [true, "Day of week is required"],
    min: [0, "Day must be between 0-6"],
    max: [6, "Day must be between 0-6"],
  },
  name: {
    type: String,
    required: [true, "Day name is required"],
    trim: true,
  },
  exercises: [trainingExerciseSchema],
  isRestDay: {
    type: Boolean,
    default: false,
  },
})

const trainingPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Training plan title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    goal: {
      type: String,
      required: [true, "Training goal is required"],
      enum: ["lose-weight", "gain-muscle", "improve-fitness", "maintain", "strength", "endurance"],
    },
    level: {
      type: String,
      required: [true, "Training level is required"],
      enum: ["beginner", "intermediate", "advanced"],
    },
    duration: {
      type: Number, // in weeks
      required: [true, "Plan duration is required"],
      min: [1, "Duration must be at least 1 week"],
      max: [52, "Duration cannot exceed 52 weeks"],
    },
    daysPerWeek: {
      type: Number,
      required: [true, "Days per week is required"],
      min: [1, "Must train at least 1 day per week"],
      max: [7, "Cannot train more than 7 days per week"],
    },
    days: [trainingDaySchema],
    isActive: {
      type: Boolean,
      default: false,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    completedWorkouts: {
      type: Number,
      default: 0,
      min: [0, "Completed workouts cannot be negative"],
    },
    totalWorkouts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for completion percentage
trainingPlanSchema.virtual("completionPercentage").get(function () {
  if (this.totalWorkouts === 0) return 0
  return Math.round((this.completedWorkouts / this.totalWorkouts) * 100)
})

// Virtual for estimated calories per workout
trainingPlanSchema.virtual("estimatedCaloriesPerWorkout").get(() => {
  // This would be calculated based on exercises and user data
  return 300 // Placeholder
})

// Pre-save middleware to calculate total workouts
trainingPlanSchema.pre("save", function (next) {
  if (this.isModified("days") || this.isModified("duration")) {
    const workoutDays = this.days.filter((day) => !day.isRestDay).length
    this.totalWorkouts = workoutDays * this.duration
  }
  next()
})

// Indexes
trainingPlanSchema.index({ user: 1, isActive: 1 })
trainingPlanSchema.index({ goal: 1, level: 1 })

module.exports = mongoose.model("TrainingPlan", trainingPlanSchema)
