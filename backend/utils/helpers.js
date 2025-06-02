/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param {Object} user - User object with weight, height, age, gender
 * @returns {number} BMR in calories
 */
const calculateBMR = (user) => {
  // Assuming male and age 25 for simplicity
  // In production, you'd want gender and age fields in user model
  const { weight, height } = user
  const age = 25 // Default age
  const gender = "male" // Default gender

  let bmr
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  return bmr
}

/**
 * Calculate daily calorie needs based on activity level
 * @param {Object} user - User object
 * @returns {number} Daily calories needed
 */
const calculateDailyCalories = (user) => {
  const bmr = calculateBMR(user)

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very-active": 1.9,
  }

  const multiplier = activityMultipliers[user.activityLevel] || 1.2
  return Math.round(bmr * multiplier)
}

/**
 * Calculate target calories based on goal
 * @param {Object} user - User object
 * @returns {Object} Calorie targets for different goals
 */
const calculateTargetCalories = (user) => {
  const maintenance = calculateDailyCalories(user)

  return {
    maintenance,
    weightLoss: Math.round(maintenance * 0.85), // 15% deficit
    weightGain: Math.round(maintenance * 1.15), // 15% surplus
    extremeLoss: Math.round(maintenance * 0.75), // 25% deficit
    slowGain: Math.round(maintenance * 1.1), // 10% surplus
  }
}

/**
 * Generate workout recommendations based on user profile
 * @param {Object} user - User object
 * @returns {Object} Workout recommendations
 */
const generateWorkoutRecommendations = (user) => {
  const { experience, goal, activityLevel } = user

  const recommendations = {
    daysPerWeek: 3,
    sessionDuration: 45, // minutes
    restDays: 1,
    intensity: "moderate",
  }

  // Adjust based on experience
  switch (experience) {
    case "beginner":
      recommendations.daysPerWeek = 3
      recommendations.sessionDuration = 30
      recommendations.intensity = "low"
      break
    case "intermediate":
      recommendations.daysPerWeek = 4
      recommendations.sessionDuration = 45
      recommendations.intensity = "moderate"
      break
    case "advanced":
      recommendations.daysPerWeek = 5
      recommendations.sessionDuration = 60
      recommendations.intensity = "high"
      break
  }

  // Adjust based on goal
  switch (goal) {
    case "lose-weight":
      recommendations.cardioRatio = 0.6 // 60% cardio, 40% strength
      recommendations.intensity = "moderate"
      break
    case "gain-muscle":
      recommendations.cardioRatio = 0.2 // 20% cardio, 80% strength
      recommendations.restDays = 2
      break
    case "improve-fitness":
      recommendations.cardioRatio = 0.4 // 40% cardio, 60% strength
      break
    case "maintain":
      recommendations.cardioRatio = 0.3 // 30% cardio, 70% strength
      break
  }

  return recommendations
}

/**
 * Calculate BMI and category
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {Object} BMI value and category
 */
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  let category
  if (bmi < 18.5) category = "underweight"
  else if (bmi < 25) category = "normal"
  else if (bmi < 30) category = "overweight"
  else category = "obese"

  return {
    value: Number.parseFloat(bmi.toFixed(1)),
    category,
  }
}

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  return date.toISOString().split("T")[0]
}

/**
 * Calculate age from birth date
 * @param {Date} birthDate - Birth date
 * @returns {number} Age in years
 */
const calculateAge = (birthDate) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

/**
 * Generate random string for tokens
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input
  return input.trim().replace(/[<>]/g, "")
}

module.exports = {
  calculateBMR,
  calculateDailyCalories,
  calculateTargetCalories,
  generateWorkoutRecommendations,
  calculateBMI,
  formatDate,
  calculateAge,
  generateRandomString,
  isValidEmail,
  sanitizeInput,
}
