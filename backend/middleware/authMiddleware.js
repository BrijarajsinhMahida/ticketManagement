const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Middleware to protect routes - ensures user is authenticated
 * @note    Verifies JWT token from Bearer header and attaches user to request
 */
exports.protect = async (req, res, next) => {
    let token;

    // Check for Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Ensure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized: No token provided'
        });
    }

    // Basic JWT format check to catch malformed tokens early
    if (token.split('.').length !== 3) {
        return res.status(401).json({
            success: false,
            error: 'Invalid token format'
        });
    }

    try {
        // 1. Verify token authenticity
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 2. Fetch user and exclude sensitive data
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Account not found. Please log in again.'
            });
        }

        // Proceed to next middleware
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        return res.status(401).json({
            success: false,
            error: 'Session expired or invalid token. Please log in again.'
        });
    }
};

/**
 * @desc    Middleware to authorize access based on roles
 * @param   {...string} roles - List of allowed roles
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Permission Denied: Your role (${req.user.role}) is not authorized to access this resource`
            });
        }
        next();
    };
};
