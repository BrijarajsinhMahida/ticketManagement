const User = require('../models/User');

/**
 * Seed a default admin user if no admin exists in the database.
 * This ensures the system is accessible after the first deployment.
 */
const seedAdmin = async () => {
    try {
        // Check if any admin exists
        const adminExists = await User.findOne({ role: 'Admin' });

        if (!adminExists) {
            console.log('No admin user found. Seeding default admin...');
            
            await User.create({
                name: 'System Admin',
                email: 'admin@test.com',
                password: 'password123', // This will be hashed by the pre-save hook in User model
                role: 'Admin'
            });

            console.log('Default admin user created: admin@test.com / password123');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error.message);
    }
};

module.exports = seedAdmin;
