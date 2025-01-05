const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { Gym, GymImage, Equipment, Slot, Subscription } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';

exports.deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers['auth']; // Get JWT token from headers
    
        if (!token) {
          return res.status(401).json({ error: 'No token provided' });
        }
    
        // Decode the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
    
        if (!decoded || !decoded.id) {
          return res.status(401).json({ error: 'Invalid token' });
        }
    
        // Find and delete the equipment
        const equipment = await Equipment.findByPk(id);
        if (!equipment) {
          return res.status(404).json({ error: 'Equipment not found' });
        }
    
        await equipment.destroy();

        // Check if equipment already exists for the gym
        const existingEquipment = await Equipment.findOne({ where: { gymId: decoded.id } });

        // If no equipment exists, update gym.complete by adding 10
        if (!existingEquipment) {
            await Gym.increment('complete', { by: -20, where: { id: decoded.id } });
        }

    
        res.json({ message: 'Equipment deleted successfully' });
      } catch (error) {
        console.error('Error deleting equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
      }

}