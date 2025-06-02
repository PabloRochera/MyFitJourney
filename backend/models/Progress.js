const mongoose = require("mongoose")

const measurementSchema = new mongoose.Schema(
  {
    chest: { type: Number, min: 0 },
    waist: { type: Number, min: 0 },
    hips: { type: Number, min: 0 },
    biceps: { type: Number, min: 0 },
    thighs: { type: Number, min: 0 },
    neck: { type: Number, min: 0 },
  },
  { _id: false },
)

const workoutLogSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  sets: [
    {
      reps: { type: Number, min: 0 },
      weight: { type: Number, min: 0 },
      duration: { type: Number, min: 0 }, // in seconds
      completed: { type: Boolean, default: false },
    },
  ],
  notes: {
    type: String,
    maxlength: [200, "Notes cannot exceed 200 characters"],
  },
})

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Progress date is required"],
      default: Date.now,
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [30, "Weight must be at least 30kg"],
      max: [300, "Weight cannot exceed 300kg"],
    },
    bodyFatPercentage: {
      type: Number,
      min: [3, "Body fat percentage must be at least 3%"],
      max: [50, "Body fat percentage cannot exceed 50%"],
    },
    measurements: measurementSchema,
    photos: [
      {
        type: {
          type: String,
          enum: ["front", "side", "back"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    workoutLog: [workoutLogSchema],
    nutrition: {
      caloriesConsumed: {
        type: Number,
        min: [0, "Calories consumed cannot be negative"],
        max: [10000, "Calories consumed cannot exceed 10000"],
      },
      macrosConsumed: {
        protein: { type: Number, min: 0, default: 0 },
        carbs: { type: Number, min: 0, default: 0 },
        fat: { type: Number, min: 0, default: 0 },
      },
      waterIntake: {
        type: Number, // in liters
        min: [0, "Water intake cannot be negative"],
        max: [10, "Water intake cannot exceed 10 liters"],
      },
    },
    mood: {
      type: String,
      enum: ["excellent", "good", "average", "poor", "terrible"],
    },
    energyLevel: {
      type: Number,
      min: [1, "Energy level must be between 1-10"],
      max: [10, "Energy level must be between 1-10"],
    },
    sleepHours: {
      type: Number,
      min: [0, "Sleep hours cannot be negative"],
      max: [24, "Sleep hours cannot exceed 24"],
    },
    sleepQuality: {
      type: String,
      enum: ["excellent", "good", "average", "poor", "terrible"],
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    completedWorkouts: {
      type: Number,
      default: 0,
      min: [0, "Completed workouts cannot be negative"],
    },
    achievements: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for BMI calculation
progressSchema.virtual("bmi").get(function () {
  if (!this.user || !this.user.height) return null
  const heightInMeters = this.user.height / 100
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(1)
})

// Virtual for weight change from previous entry
progressSchema.virtual("weightChange").get(() => {
  // This would need to be populated with previous entry data
  return null // Placeholder
})

// Indexes for better query performance
progressSchema.index({ user: 1, date: -1 })
progressSchema.index({ user: 1, createdAt: -1 })

// Ensure only one progress entry per user per day
progressSchema.index({ user: 1, date: 1 }, { unique: true })

module.exports = mongoose.model("Progress", progressSchema)
