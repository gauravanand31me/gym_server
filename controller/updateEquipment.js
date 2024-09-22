const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { Gym, GymImage, Equipment, Slot, Subscription } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';

exports.updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity } = req.body;
        const token = req.headers['login_id']; // Get JWT token from headers
    
        if (!token) {
          return res.status(401).json({ error: 'No token provided' });
        }
    
        // Decode the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
    
        if (!decoded || !decoded.id) {
          return res.status(401).json({ error: 'Invalid token' });
        }
    
        // Validate input
        if (!name || quantity === undefined) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        // Find the equipment to update
        const equipment = await Equipment.findByPk(id);
        if (!equipment) {
          return res.status(404).json({ error: 'Equipment not found' });
        }
    
        // Update equipment details
        equipment.name = name;
        equipment.quantity = quantity;
        await equipment.save();
    
        res.json({ message: 'Equipment updated successfully' });
      } catch (error) {
        console.error('Error updating equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
      }

}