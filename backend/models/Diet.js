const mongoose = require("mongoose")

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Meal name is required"],
    trim: true,
  },
  description: {
    type: String,
    maxlength: [300, "Meal description cannot exceed 300 characters"],
  },
  calories: {
    type: Number,
    required: [true, "Meal calories are required"],
    min: [0, "Calories cannot be negative"],
  },
  macros: {
    protein: { type: Number, min: 0, default: 0 },
    carbs: { type: Number, min: 0, default: 0 },
    fat: { type: Number, min: 0, default: 0 },
    fiber: { type: Number, min: 0, default: 0 },
  },
  ingredients: [
    {
      name: { type: String, required: true },
      amount: { type: String, required: true },
      unit: { type: String, required: true },
    },
  ],
  instructions: [
    {
      type: String,
      maxlength: [200, "Each instruction cannot exceed 200 characters"],
    },
  ],
  prepTime: {
    type: Number, // in minutes
    min: [0, "Prep time cannot be negative"],
  },
  mealType: {
    type: String,
    required: [true, "Meal type is required"],
    enum: ["breakfast", "lunch", "dinner", "snack", "pre-workout", "post-workout"],
  },
})

const dietSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Diet title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    calories: {
      type: Number,
      required: [true, "Daily calories are required"],
      min: [800, "Daily calories must be at least 800"],
      max: [5000, "Daily calories cannot exceed 5000"],
    },
    macros: {
  protein: {
    type: Number,
    required: true,
    min: 10,
    max: 50,
  },
  carbs: {
    type: Number,
    required: true,
    min: 5,   // keto suele ser 5-10 %
    max: 70,
  },
  fat: {
    type: Number,
    required: true,
    min: 15,
    max: 80,  // permite hasta 80 %
  },
},

    meals: [mealSchema],
    preferences: {
      vegetarian: { type: Boolean, default: false },
      vegan: { type: Boolean, default: false },
      glutenFree: { type: Boolean, default: false },
      lactoseFree: { type: Boolean, default: false },
      nutFree: { type: Boolean, default: false },
      lowCarb: { type: Boolean, default: false },
      highProtein: { type: Boolean, default: false },
    },
    benefits: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Each benefit cannot exceed 50 characters"],
      },
    ],
    restrictions: [
      {
        type: String,
        trim: true,
      },
    ],
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
    adherenceScore: {
      type: Number,
      min: [0, "Adherence score cannot be negative"],
      max: [100, "Adherence score cannot exceed 100"],
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for total macro grams
dietSchema.virtual("macroGrams").get(function () {
  const proteinGrams = (this.calories * this.macros.protein) / 100 / 4
  const carbsGrams = (this.calories * this.macros.carbs) / 100 / 4
  const fatGrams = (this.calories * this.macros.fat) / 100 / 9

  return {
    protein: Math.round(proteinGrams),
    carbs: Math.round(carbsGrams),
    fat: Math.round(fatGrams),
  }
})

// Virtual for meal count by type
dietSchema.virtual("mealCounts").get(function () {
  const counts = {}
  this.meals.forEach((meal) => {
    counts[meal.mealType] = (counts[meal.mealType] || 0) + 1
  })
  return counts
})

// Validation for macro percentages
dietSchema.pre("save", function (next) {
  const total = this.macros.protein + this.macros.carbs + this.macros.fat
  if (Math.abs(total - 100) > 1) {
    return next(new Error("Macro percentages must sum to 100%"))
  }
  next()
})

// Indexes
dietSchema.index({ user: 1, isActive: 1 })
dietSchema.index({ "preferences.vegetarian": 1 })
dietSchema.index({ "preferences.vegan": 1 })

module.exports = mongoose.model("Diet", dietSchema)
