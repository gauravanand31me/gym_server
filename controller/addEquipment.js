const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { Gym, GymImage, Equipment, Slot, Subscription } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';
const { v4: uuidv4 } = require('uuid');

exports.addEquipment = async (req, res) => {
    try {
        const { name, quantity } = req.body;
        const token = req.headers['auth']; // Get JWT token from headers

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Decode the JWT token
        const decoded = jwt.verify(token, JWT_SECRET); // Replace process.env.JWT_SECRET with your secret key

        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const gymId = decoded.id;
        // Optional: Decode JWT token to verify user identity and permissions (if needed)

        // Validate input
        if (!name || quantity === undefined || !gymId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Fetch the gym to ensure it exists
        const gym = await Gym.findByPk(gymId);
        if (!gym) {
            return res.status(404).json({ error: 'Gym not found' });
        }

        // Create new equipment entry
        await Equipment.create({
            id: uuidv4(),
            name,
            quantity,
            gymId
        });

        res.status(201).json({ message: 'Equipment added successfully' });
    } catch (error) {
        console.error('Error adding equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}