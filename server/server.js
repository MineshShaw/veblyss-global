const express = require('express')
const cors = require('cors')
const connectDB = require('./config/mongodb.js')
const authRoutes = require('./routes/authRoutes')
require('dotenv').config()

// App Config
const app = express()
const port = process.env.PORT || 3000

// Connect to MongoDB
connectDB()

// Middlewares
app.use(express.json({ limit: '50mb' }))
app.use(cors())

// Routes
app.use('/api/auth', authRoutes)

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'VeBlyss Global Server is running!',
        version: '1.0.0'
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

app.listen(port, () => {
    console.log(`VeBlyss Global Server listening on port ${port}!`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
