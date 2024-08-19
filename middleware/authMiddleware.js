const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).send('Not authorized, token failed');
        }
    } else {
        return res.status(401).send('Not authorized, no token');
    }
});

const restrictTo = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).send('You do not have permission to perform this action');
        }
        next();
    });
};

const optionalAuth = asyncHandler(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
            } catch (error) {
                console.error("Optional auth error:", error.message);
            }
        }
    }
    next();
});

module.exports = { protect, restrictTo, optionalAuth };
