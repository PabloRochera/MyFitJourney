const { body, validationResult } = require("express-validator")

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}

const validateRegistration = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),

  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),

  body("height").isInt({ min: 100, max: 250 }).withMessage("Height must be between 100 and 250 cm"),

  body("weight").isFloat({ min: 30, max: 300 }).withMessage("Weight must be between 30 and 300 kg"),

  body("goal").isIn(["lose-weight", "gain-muscle", "improve-fitness", "maintain"]).withMessage("Invalid goal"),

  body("activityLevel")
    .isIn(["sedentary", "light", "moderate", "active", "very-active"])
    .withMessage("Invalid activity level"),

  body("experience").isIn(["beginner", "intermediate", "advanced"]).withMessage("Invalid experience level"),

  handleValidationErrors,
]

const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
]

const validateProgress = [
  body("weight").isFloat({ min: 30, max: 300 }).withMessage("Weight must be between 30 and 300 kg"),

  body("measurements.chest").optional().isFloat({ min: 0 }).withMessage("Chest measurement must be positive"),

  body("measurements.waist").optional().isFloat({ min: 0 }).withMessage("Waist measurement must be positive"),

  body("measurements.hips").optional().isFloat({ min: 0 }).withMessage("Hips measurement must be positive"),

  body("completedWorkouts").optional().isInt({ min: 0 }).withMessage("Completed workouts must be a positive integer"),

  body("caloriesConsumed")
    .optional()
    .isInt({ min: 0, max: 10000 })
    .withMessage("Calories consumed must be between 0 and 10000"),

  handleValidationErrors,
]

const validateDiet = [
  body("title").trim().isLength({ min: 1, max: 100 }).withMessage("Title must be between 1 and 100 characters"),

  body("calories").isInt({ min: 800, max: 5000 }).withMessage("Daily calories must be between 800 and 5000"),

  body("protein").isInt({ min: 10, max: 50 }).withMessage("Protein percentage must be between 10 and 50"),

  body("carbs").isInt({ min: 20, max: 70 }).withMessage("Carbs percentage must be between 20 and 70"),

  body("fat").isInt({ min: 15, max: 50 }).withMessage("Fat percentage must be between 15 and 50"),

  handleValidationErrors,
]

module.exports = {
  validateRegistration,
  validateLogin,
  validateProgress,
  validateDiet,
  handleValidationErrors,
}
