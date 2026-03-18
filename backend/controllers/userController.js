const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const { search } = req.query;
        let query = {};

        // Build search query for name or email
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean() for better performance as we'll be adding stats manually

        /**
         * AGGREGATION LOGIC:
         * For each user, we calculate ticket statistics (Open, In_Progress, Resolved)
         * by running a MongoDB aggregation on the Ticket collection. 
         * This provides real-time workload data for the Admin Directory.
         */
        const Ticket = require('../models/Ticket');
        
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const stats = await Ticket.aggregate([
                { $match: { assignedTo: user._id } },
                { $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }}
            ]);

            const ticketStats = {
                Open: 0,
                In_Progress: 0,
                Resolved: 0
            };

            // Map aggregation results to the stats object
            stats.forEach(stat => {
                const statusKey = stat._id === 'In_Progress' ? 'In_Progress' : stat._id;
                if (ticketStats.hasOwnProperty(statusKey)) {
                    ticketStats[statusKey] = stat.count;
                }
            });

            return { ...user, ticketStats };
        }));

        res.status(200).json({
            success: true,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data: usersWithStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'User already exists'
            });
        }
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
