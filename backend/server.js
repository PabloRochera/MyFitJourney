const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const exerciseRoutes = require("./routes/exercises")
const trainingPlanRoutes = require("./routes/trainingPlans")
const dietRoutes = require("./routes/diets")
const progressRoutes = require("./routes/progress")
const statsRoutes = require("./routes/stats")
const routineRoutes = require("./routes/routines")
const errorHandler = require("./middleware/errorHandler")
const { authenticateToken } = require("./middleware/auth")

const app = express()
const PORT = process.env.PORT || 3001

// Seguridad y utilidades
app.use(helmet())
app.use(compression())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later.",
})
app.use("/api/", limiter)

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "my-fit-journey-6wltpqadh-pablorocheras-projects.vercel.app",
    credentials: true,
  })
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"))
}

app.set('trust proxy', 1)

// MongoDB
console.log("🔄 Connecting to MongoDB...")
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas")
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  })

// Rutas
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
})

app.use("/api/auth", authRoutes)
app.use("/api/exercises", authenticateToken, exerciseRoutes)
app.use("/api/training-plans", authenticateToken, trainingPlanRoutes)
app.use("/api/diets", authenticateToken, dietRoutes)
app.use("/api/progress", authenticateToken, progressRoutes)
app.use("/api/stats", authenticateToken, statsRoutes)
app.use("/api/routines", authenticateToken, routineRoutes)

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" })
})

app.use(errorHandler)

// Shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...")
  mongoose.connection.close(() => {
    console.log("✅ MongoDB connection closed.")
    process.exit(0)
  })
})

// Iniciar servidor directamente en puerto 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`)
})


module.exports = app
