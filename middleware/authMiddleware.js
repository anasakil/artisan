const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Existing protect middleware remains unchanged
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Authorization denied: No token provided' });
        return; // Stop further execution in this callback
    }
    

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Function to restrict routes to certain roles
const restrictTo = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403); // Forbidden
            throw new Error('You do not have permission to perform this action');
        }

        next();
    });
};

module.exports = { protect, restrictTo };


const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            // Log the error but do not block the request
            console.error("Optional auth error:", error.message);
        }
    }
    next();
};

module.exports = optionalAuth;

