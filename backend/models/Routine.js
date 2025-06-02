const mongoose = require("mongoose")

const routineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Routine name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exercises: [{
      exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
        required: true
      },
      title: String,
      description: String,
      instructions: [String],
      category: String,
      level: String,
      muscleGroups: [String],
      equipment: [String],
      duration: String,
      intensity: String,
      calories: Number,
      image: String,
      videoUrl: String,
      tags: [String],
      sets: Number,
      reps: Number,
      time: Number,
      rest: Number,
      weight: Number,
      notes: String,
      order: Number
    }],
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Índices para mejor rendimiento
routineSchema.index({ user: 1, isActive: 1 })

// Limitar a 10 ejercicios por rutina
routineSchema.pre("save", function (next) {
  if (this.exercises.length > 10) {
    return next(new Error("No puedes añadir más de 10 ejercicios a una rutina"))
  }
  next()
})

module.exports = mongoose.model("Routine", routineSchema) 