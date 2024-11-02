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

        const remainingEquipment = await Equipment.findAll({ where: { gymId: decoded.id } });
        if (remainingEquipment.length === 0 && gym.complete > 10) {
            // Reduce `complete` by 10 only if there are no remaining equipment items
            const updatedComplete = Math.max(gym.complete - 10, 0); // Ensure `complete` does not go below 0
            await gym.update({ complete: updatedComplete });
        }
    
        res.json({ message: 'Equipment deleted successfully' });
      } catch (error) {
        console.error('Error deleting equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
      }

}