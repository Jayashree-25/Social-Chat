import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

//POST - REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //Check if user exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exist' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        //JWT token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ token, user: { name: newUser.name, email: newUser.email } });
    } catch (err) {
        console.error('Register error: ', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

//POST - LOGIN ROUTE
router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        //compare entered password with hashed one
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //generate JWT
        const token = jwt.sign(
            { userId: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            user: { name: existingUser.name, email: existingUser.email }
        });
    } catch (err) {
        console.error('Login error: ', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;