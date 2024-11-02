const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { Gym, GymImage, Equipment, Slot, Subscription } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';

exports.getEquipment = async (req, res) => {
    try {
        const token = req.headers['auth']; // Get JWT token from headers
    
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
    
        // Decode the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
    
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        const gymId = decoded.id;
        
        // Validate gymId
        if (!gymId) {
            return res.status(400).json({ error: 'Gym ID is required' });
        }
    
        // Fetch the gym to ensure it exists
        const gym = await Gym.findByPk(gymId);
        if (!gym) {
            return res.status(404).json({ error: 'Gym not found' });
        }
    
        // Fetch all equipment for the gym
        const equipmentList = await Equipment.findAll({ where: { gymId } });

        // Check if equipment list is empty or not and update completion
        let updatedComplete = gym.complete;

        if (equipmentList.length > 0 && updatedComplete < 100) {
            // Increment by 10% if there is equipment and completion is not already at 100%
            updatedComplete = Math.min(updatedComplete + 10, 100);
        } else if (equipmentList.length === 0 && updatedComplete > 10) {
            // Decrement by 10% if no equipment and completion is above 10%
            updatedComplete = updatedComplete - 10;
        }

        // Only update if completion value changed
        if (updatedComplete !== gym.complete) {
            await gym.update({ complete: updatedComplete });
        }

        res.json({
            equipmentList
        });
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
