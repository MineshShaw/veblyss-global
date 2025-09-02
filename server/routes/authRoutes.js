const express = require('express')
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword
} = require('../controllers/authController')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// Public routes
router.post('/register', registerUser)
router.post('/login', loginUser)

// Protected routes (require authentication)
router.get('/profile', authenticateToken, getUserProfile)
router.put('/profile', authenticateToken, updateUserProfile)
router.put('/change-password', authenticateToken, changePassword)

module.exports = router
