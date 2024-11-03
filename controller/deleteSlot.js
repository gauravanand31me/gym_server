const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { Gym, GymImage, Equipment, Slot, Subscription } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';

exports.deleteSlot = async (req, res) => {
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
        const slot = await Slot.findByPk(id);
        if (!slot) {
          return res.status(404).json({ error: 'Slot not found' });
        }
    
        await slot.destroy();

        const existingSlot = await Slot.findOne({ where: { gymId: decoded.id} });

        // If no equipment exists, update gym.complete by adding 10
        if (!existingSlot) {
            await Gym.increment('complete', { by: -10, where: { id: decoded.id } });
        }
    
        res.json({ message: 'Slot deleted successfully' });
      } catch (error) {
        console.error('Error deleting equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
      }

}