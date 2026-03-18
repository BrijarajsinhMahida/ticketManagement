const express = require('express');
const router = express.Router();
const { getTickets, createTicket, updateTicket } = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get tickets (Admin see all, Employee see assigned)
 *     description: Returns a list of tickets with optional filters and pagination. Employees are automatically restricted to tickets assigned to them.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Open, In_Progress, Resolved]
 *         description: Filter by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High]
 *         description: Filter by priority
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by ticket title (case-insensitive)
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: Admin only - Filter by user ID
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
 *         description: List of tickets retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', getTickets);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket (Admin only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               priority: { type: string, enum: [Low, Medium, High] }
 *               status: { type: string, enum: [Open, In_Progress, Resolved] }
 *               assignedTo: { type: string, description: User ID }
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authorize('Admin'), createTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   patch:
 *     summary: Update an existing ticket
 *     description: Admins can update all fields. Employees can update 'status' and 'assignedTo' of assigned tickets.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               priority: { type: string, enum: [Low, Medium, High] }
 *               status: { type: string, enum: [Open, In_Progress, Resolved] }
 *               assignedTo: { type: string, description: User ID }
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.patch('/:id', updateTicket);

module.exports = router;
