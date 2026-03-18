const Ticket = require('../models/Ticket');

/**
 * @desc    Get all tickets with filters and pagination
 * @route   GET /api/tickets
 * @access  Private
 * @note    Admins see all tickets, Employees only see assigned tickets.
 */
exports.getTickets = async (req, res) => {
    try {
        const { status, priority, search, assignedTo } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6; // Reduced limit for better UX
        const skip = (page - 1) * limit;

        let query = {};

        // Apply filters if provided
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (assignedTo && req.user.role === 'Admin') {
            query.assignedTo = assignedTo;
        }

        /**
         * ROLE-BASED ACCESS CONTROL (RBAC)
         * If the logged-in user is an Employee, only fetch tickets 
         * where they are the assignee.
         */
        if (req.user.role === 'Employee') {
            query.assignedTo = req.user.id;
        }

        const total = await Ticket.countDocuments(query);
        const tickets = await Ticket.find(query)
            .populate('assignedTo', 'name email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        res.status(200).json({
            success: true,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data: tickets
        });
    } catch (error) {
        console.error('getTickets Error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

/**
 * @desc    Create a new ticket
 * @route   POST /api/tickets
 * @access  Private (Admin only)
 */
exports.createTicket = async (req, res) => {
    try {
        const ticketData = { ...req.body };
        
        // Handle empty assignedTo string from frontend
        if (ticketData.assignedTo === '') {
            ticketData.assignedTo = null;
        }
        
        const ticket = await Ticket.create(ticketData);
        
        // Populate assignee details before sending response
        const populatedTicket = await Ticket.findById(ticket._id).populate('assignedTo', 'name email role');
        
        res.status(201).json({
            success: true,
            data: populatedTicket
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @desc    Update an existing ticket
 * @route   PATCH /api/tickets/:id
 * @access  Private
 * @note    Admins can update all fields. Employees can update 'status' and 'assignedTo' of assigned tickets.
 */
exports.updateTicket = async (req, res) => {
    try {
        // Find existing ticket first to check permissions
        let ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: 'Ticket not found'
            });
        }

        /**
         * ROLE-BASED ACCESS CONTROL (RBAC) & AUTHORIZATION
         */
        const updateData = {};
        if (req.user.role === 'Employee') {
            // Verify ownership: Employee must be the assignee
            if (!ticket.assignedTo || ticket.assignedTo.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    error: 'Access Denied: You are not authorized to update this ticket'
                });
            }
            
            // Allow Employees to update ONLY 'status' and 'assignedTo'
            // We ignore other fields instead of returning error for better compatibility with frontend forms
            const allowedFields = ['status', 'assignedTo'];
            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updateData[field] = req.body[field];
                }
            });
        } else {
            // Admin Permissions: Full update capability
            Object.assign(updateData, req.body);
            
            // Handle empty assignedTo string
            if (updateData.assignedTo === '') {
                updateData.assignedTo = null;
            }
        }

        // Perform the update
        ticket = await Ticket.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        }).populate('assignedTo', 'name email role');

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
