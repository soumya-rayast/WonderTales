const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User signup function 
const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({ error: true, message: "Fill all the fields" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user email exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ error: true, message: "User already exists. Create a new account" });
        }

        // Hash the password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        await user.save();

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined");
            return res.status(500).json({ error: true, message: "Internal Server Error" });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "72h" }
        );

        return res.status(201).json({
            error: false,
            user: { fullName: user.fullName, email: user.email },
            accessToken,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};
// User login function
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ error: true, message: "Email and password are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user exists
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ error: true, message: "Invalid credentials" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: true, message: "Invalid credentials" });
        }

        // Generate JWT Token
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined");
            return res.status(500).json({ error: true, message: "Internal Server Error" });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "72h" }
        );

        return res.status(200).json({
            error: false,
            message: "User logged in successfully",
            user: { fullName: user.fullName, email: user.email },
            accessToken,
        });

    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};
// Get user function
const getUser = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(401).json({ error: true, message: "User not found" });
        }

        return res.status(200).json({
            error: false,
            user,
            message: "User retrieved successfully",
        });

    } catch (error) {
        console.error("Error in getUser:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};
module.exports = {
    signup,
    login,
    getUser
};
