const mongoose = require("mongoose")

const exerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Exercise title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Exercise description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    instructions: [
      {
        type: String,
        required: true,
        maxlength: [200, "Each instruction cannot exceed 200 characters"],
      },
    ],
    category: {
      type: String,
      required: [true, "Exercise category is required"],
      enum: ["chest", "back", "shoulders", "arms", "legs", "core", "cardio", "full-body"],
    },
    level: {
      type: String,
      required: [true, "Exercise level is required"],
      enum: ["beginner", "intermediate", "advanced"],
},

muscleGroups: {
  type: [String],
  enum: [
    "chest",
    "back",
    "legs",
    "arms",
    "shoulders",
    "glutes",
    "calves",
    "core",
    "obliques",
    "triceps",
    "biceps",
    "quadriceps",
    "hamstrings",
    "abs",
    "lats",
    "forearms",
    "traps",
    "cardio", 
    "adductors"
  ],
},
    equipment: [
      {
        type: String,
        required: true,
        enum: [
          "none",
          "dumbbells",
          "barbell",
          "resistance-bands",
          "kettlebell",
          "pull-up-bar",
          "bench",
          "machine",
          "cable",
          "medicine-ball",
          "mat",
        ],
      },
    ],
    duration: {
      type: String,
      required: [true, "Exercise duration is required"],
    },
    intensity: {
      type: String,
      required: [true, "Exercise intensity is required"],
      enum: ["low", "moderate", "high", "very-high"],
    },
    calories: {
      type: Number,
      min: [0, "Calories cannot be negative"],
      max: [1000, "Calories cannot exceed 1000 per exercise"],
    },
    image: {
      type: String,
      default: "/placeholder.svg?height=200&width=300",
    },
    videoUrl: {
      type: String,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+/.test(v),
        message: "Video URL must be a valid URL",
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better query performance
exerciseSchema.index({ category: 1, level: 1 })
exerciseSchema.index({ muscleGroups: 1 })
exerciseSchema.index({ equipment: 1 })
exerciseSchema.index({ title: "text", description: "text" })

// Virtual for difficulty score
exerciseSchema.virtual("difficultyScore").get(function () {
  const scores = { beginner: 1, intermediate: 2, advanced: 3 }
  return scores[this.level] || 1
})

module.exports = mongoose.model("Exercise", exerciseSchema)
