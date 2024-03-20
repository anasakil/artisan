const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
