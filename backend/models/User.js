const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    height: {
      type: Number,
      required: [true, "Height is required"],
      min: [100, "Height must be at least 100cm"],
      max: [250, "Height cannot exceed 250cm"],
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [30, "Weight must be at least 30kg"],
      max: [300, "Weight cannot exceed 300kg"],
    },
    goal: {
      type: String,
      required: [true, "Goal is required"],
      enum: ["lose-weight", "gain-muscle", "improve-fitness", "maintain"],
    },
    activityLevel: {
      type: String,
      required: [true, "Activity level is required"],
      enum: ["sedentary", "light", "moderate", "active", "very-active"],
    },
    experience: {
      type: String,
      required: [true, "Experience level is required"],
      enum: ["beginner", "intermediate", "advanced"],
    },
    preferences: {
      units: {
        type: String,
        enum: ["metric", "imperial"],
        default: "metric",
      },
      notifications: {
        workouts: { type: Boolean, default: true },
        nutrition: { type: Boolean, default: true },
        progress: { type: Boolean, default: true },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for BMI calculation
userSchema.virtual("bmi").get(function () {
  const heightInMeters = this.height / 100
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(1)
})

// Virtual for BMI category
userSchema.virtual("bmiCategory").get(function () {
  const bmi = this.bmi
  if (bmi < 18.5) return "underweight"
  if (bmi < 25) return "normal"
  if (bmi < 30) return "overweight"
  return "obese"
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

module.exports = mongoose.model("User", userSchema)
