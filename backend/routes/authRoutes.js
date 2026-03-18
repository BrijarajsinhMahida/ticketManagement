const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               type: object
 *               required: [name, email, password]
 *               properties:
 *                 name: { type: string }
 *                 email: { type: string, format: email }
 *                 password: { type: string, minLength: 6 }
 *                 role: { type: string, enum: [Employee, Admin] }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/register', protect, authorize('Admin'), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               type: object
 *               required: [email, password]
 *               properties:
 *                 email: { type: string, format: email }
 *                 password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/me', protect, getMe);

module.exports = router;
