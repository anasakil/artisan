const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

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
            res.status(401).send('Not authorized, token failed');
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Authorization denied: No token provided' });
        return; 
    }
    

    if (!token) {
        res.status(401).send('Not authorized, no token');
    }
});

const restrictTo = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403).send('You do not have permission to perform this action');
        }

        next();
    });
};



const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            console.error("Optional auth error:", error.message);
        }
    }
    next();
};

module.exports = { protect, restrictTo ,optionalAuth};

