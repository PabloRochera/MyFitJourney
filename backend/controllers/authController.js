const User = require("../models/User")
const { generateToken } = require("../middleware/auth")
const bcrypt = require("bcryptjs")

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password, height, weight, goal, activityLevel, experience } = req.body
      
      console.log("Datos de registro recibidos:", { 
        name, 
        email, 
        passwordLength: password?.length, 
        height, 
        weight, 
        goal, 
        activityLevel, 
        experience 
      });

      // Validaciones adicionales
      if (!name || !email || !password || !height || !weight || !goal || !activityLevel || !experience) {
        console.log("Error de validación: Campos faltantes", { 
          name: !!name, 
          email: !!email, 
          password: !!password, 
          height: !!height, 
          weight: !!weight, 
          goal: !!goal, 
          activityLevel: !!activityLevel, 
          experience: !!experience 
        });
        return res.status(400).json({
          success: false,
          message: "Todos los campos son obligatorios",
        })
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        console.log("Error: Email ya existe", { email });
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        })
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        height,
        weight,
        goal,
        activityLevel,
        experience,
      })

      try {
        await user.save()
      } catch (saveError) {
        console.error("Error al guardar usuario:", saveError);
        return res.status(400).json({
          success: false,
          message: saveError.message || "Error en la validación de datos",
          details: saveError.errors ? Object.keys(saveError.errors).map(key => ({
            field: key,
            message: saveError.errors[key].message
          })) : []
        });
      }

      // Generate token
      const token = generateToken(user._id)

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          height: user.height,
          weight: user.weight,
          goal: user.goal,
          activityLevel: user.activityLevel,
          experience: user.experience,
          bmi: user.bmi,
          bmiCategory: user.bmiCategory,
        },
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      })
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select("+password")
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        })
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        })
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        })
      }

      // Update last login
      user.lastLogin = new Date()
      await user.save()

      // Generate token
      const token = generateToken(user._id)

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          height: user.height,
          weight: user.weight,
          goal: user.goal,
          activityLevel: user.activityLevel,
          experience: user.experience,
          bmi: user.bmi,
          bmiCategory: user.bmiCategory,
          lastLogin: user.lastLogin,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      })
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      res.json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          height: user.height,
          weight: user.weight,
          goal: user.goal,
          activityLevel: user.activityLevel,
          experience: user.experience,
          bmi: user.bmi,
          bmiCategory: user.bmiCategory,
          preferences: user.preferences,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        },
      })
    } catch (error) {
      console.error("Get profile error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get profile",
        error: error.message,
      })
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const allowedUpdates = ["name", "height", "weight", "goal", "activityLevel", "experience", "preferences"]
      const updates = {}

      // Filter allowed updates
      Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key]
        }
      })

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          height: user.height,
          weight: user.weight,
          goal: user.goal,
          activityLevel: user.activityLevel,
          experience: user.experience,
          bmi: user.bmi,
          bmiCategory: user.bmiCategory,
          preferences: user.preferences,
        },
      })
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
        error: error.message,
      })
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        })
      }

      const user = await User.findById(req.user._id).select("+password")
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword)
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        })
      }

      // Update password
      user.password = newPassword
      await user.save()

      res.json({
        success: true,
        message: "Password changed successfully",
      })
    } catch (error) {
      console.error("Change password error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to change password",
        error: error.message,
      })
    }
  },

  // Forgot password (placeholder)
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body

      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      // In a real application, you would:
      // 1. Generate a reset token
      // 2. Save it to the database with expiration
      // 3. Send email with reset link

      res.json({
        success: true,
        message: "Password reset instructions sent to your email",
      })
    } catch (error) {
      console.error("Forgot password error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to process forgot password request",
        error: error.message,
      })
    }
  },

  // Reset password (placeholder)
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body

      // In a real application, you would:
      // 1. Verify the reset token
      // 2. Check if it's not expired
      // 3. Update the user's password

      res.json({
        success: true,
        message: "Password reset successfully",
      })
    } catch (error) {
      console.error("Reset password error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to reset password",
        error: error.message,
      })
    }
  },

  // Delete account
  deleteAccount: async (req, res) => {
    try {
      const { password } = req.body

      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password is required to delete account",
        })
      }

      const user = await User.findById(req.user._id).select("+password")
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        })
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Incorrect password",
        })
      }

      // Soft delete - deactivate account
      user.isActive = false
      await user.save()

      res.json({
        success: true,
        message: "Account deleted successfully",
      })
    } catch (error) {
      console.error("Delete account error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to delete account",
        error: error.message,
      })
    }
  },

  // Logout (placeholder for token blacklisting)
  logout: async (req, res) => {
    try {
      // In a real application with token blacklisting:
      // 1. Add token to blacklist
      // 2. Set expiration time

      res.json({
        success: true,
        message: "Logged out successfully",
      })
    } catch (error) {
      console.error("Logout error:", error)
      res.status(500).json({
        success: false,
        message: "Failed to logout",
        error: error.message,
      })
    }
  },
}

module.exports = authController
