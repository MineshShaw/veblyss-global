const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// Hash password using crypto (recommend using bcrypt in production)
const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return { salt, hash }
}

// Verify password
const verifyPassword = (password, hash, salt) => {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return hash === verifyHash
}

// Generate JWT token
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    })
}

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    } catch (error) {
        throw new Error('Invalid token')
    }
}

module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken
}
