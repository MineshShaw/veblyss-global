const userModel = require('../models/userModel')
const { hashPassword, verifyPassword, generateToken } = require('../utils/auth')
const validator = require('validator')

// Register new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email'
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            })
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            })
        }

        // Hash password
        const { salt, hash } = hashPassword(password)

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hash,
            salt,
            cartdata: {},
            wishlistdata: {},
            orderdata: {},
            addressdata: {},
            admin: false
        })

        const savedUser = await newUser.save()

        // Generate token
        const token = generateToken({ userId: savedUser._id })

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                admin: savedUser.admin
            }
        })

    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email'
            })
        }

        // Find user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // Verify password
        const isPasswordValid = verifyPassword(password, user.password, user.salt)
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // Generate token
        const token = generateToken({ userId: user._id })

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                admin: user.admin
            }
        })

    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password -salt')
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.json({
            success: true,
            user
        })

    } catch (error) {
        console.error('Get profile error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body
        const updateData = {}

        if (name) updateData.name = name
        if (email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter a valid email'
                })
            }
            
            // Check if email is already taken by another user
            const existingUser = await userModel.findOne({ 
                email, 
                _id: { $ne: req.user._id } 
            })
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already taken'
                })
            }
            
            updateData.email = email
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true }
        ).select('-password -salt')

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        })

    } catch (error) {
        console.error('Update profile error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// Change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            })
        }

        // Get user with password
        const user = await userModel.findById(req.user._id)
        
        // Verify current password
        const isCurrentPasswordValid = verifyPassword(currentPassword, user.password, user.salt)
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            })
        }

        // Hash new password
        const { salt, hash } = hashPassword(newPassword)

        // Update password
        await userModel.findByIdAndUpdate(req.user._id, {
            password: hash,
            salt
        })

        res.json({
            success: true,
            message: 'Password changed successfully'
        })

    } catch (error) {
        console.error('Change password error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword
}
