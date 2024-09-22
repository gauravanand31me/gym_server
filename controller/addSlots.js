const jwt = require('jsonwebtoken');
const { Gym, Slot } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';
const { v4: uuidv4 } = require('uuid');

exports.addSlot = async (req, res) => {
    try {
        const { capacity, price, startTime, timePeriod } = req.body; // Include all required fields
        const token = req.headers['login_id']; // Get JWT token from headers

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Decode the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const gymId = decoded.id;

        // Validate input
        if (capacity === undefined || price === undefined || !timePeriod || !gymId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Fetch the gym to ensure it exists
        const gym = await Gym.findByPk(gymId);
        if (!gym) {
            return res.status(404).json({ error: 'Gym not found' });
        }

        // Create new slot entry
        await Slot.create({
            id: uuidv4(),
            capacity,
            price,
            startTime, // Include startTime if needed
            timePeriod, // Ensure timePeriod is included and is an integer
            gymId
        });

        res.status(201).json({ message: 'Slot added successfully' });
    } catch (error) {
        console.error('Error adding slot:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
