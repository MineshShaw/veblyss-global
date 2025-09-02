const { verifyToken } = require('../utils/auth')
const userModel = require('../models/userModel')

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            })
        }

        const decoded = verifyToken(token)
        const user = await userModel.findById(decoded.userId).select('-password -salt')
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token - user not found'
            })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        })
    }
}

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (!req.user.admin) {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        })
    }
    next()
}

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]

        if (token) {
            const decoded = verifyToken(token)
            const user = await userModel.findById(decoded.userId).select('-password -salt')
            req.user = user
        }
        next()
    } catch (error) {
        // Continue without authentication
        next()
    }
}

module.exports = {
    authenticateToken,
    requireAdmin,
    optionalAuth
}
