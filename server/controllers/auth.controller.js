import User from '../models/user.model.js'
import bcrypt from "bcryptjs";
import generateToken from "../config/jwt.js"

export const signup = async (req, res) => {
    try {
        const { name,  email, password } = req.body;

        // Validate request body
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate user email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        // Password strength
        if (password.length < 6) {
            return res.status(400).json({ error: "Weak password. It must be at least 6 characters long." });
        }

        // Password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = await generateToken(newUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        return res.status(201).json({ user: newUser, token });
    } catch (error) {
        return res.status(500).json({ error: "Error creating user" });
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.query;

        // Validate request body
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Successful login
        const token = await generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        return res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error signing in" });
    }
}

export const signout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ error: "Error signing out" });
    }
}