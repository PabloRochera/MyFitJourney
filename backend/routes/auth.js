const express = require("express")
const { validateRegistration, validateLogin } = require("../middleware/validation")
const { authenticateToken } = require("../middleware/auth")
const authController = require("../controllers/authController")

const router = express.Router()

// Public routes
router.post("/register", validateRegistration, authController.register)
router.post("/login", validateLogin, authController.login)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", authController.resetPassword)

// Protected routes
router.get("/profile", authenticateToken, authController.getProfile)
router.put("/profile", authenticateToken, authController.updateProfile)
router.post("/change-password", authenticateToken, authController.changePassword)
router.delete("/account", authenticateToken, authController.deleteAccount)
router.post("/logout", authenticateToken, authController.logout)

module.exports = router
