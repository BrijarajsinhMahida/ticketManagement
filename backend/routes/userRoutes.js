const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

/**
 * Access Control:
 * - Administrators can perform all operations.
 * - Employees can GET the user list (required for ticket assignment) but cannot create users.
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin or Employee)
 *     description: Returns a list of all users with their current ticket statistics (Open, In_Progress, Resolved). Accessible to Administrators and Employees.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email (case-insensitive)
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authorize('Admin', 'Employee'), getUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authorize('Admin'), createUser);

module.exports = router;
