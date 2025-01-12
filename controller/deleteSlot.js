const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { Gym, Slot } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';
const { Op } = require('sequelize');

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
    
        // Find the slot and update timePeriod to 0 or 1 based on its current value
        const slot = await Slot.findByPk(id);
        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }
    
        // Update timePeriod: set to 0 if not already 0, otherwise set to 1
        if (slot.timePeriod === 0) {
            await slot.update({ timePeriod: 1 });
        } else {
            await slot.update({ timePeriod: 0 });
        }

        const existingSlot = await Slot.findOne({ where: { gymId: decoded.id, timePeriod: { [Op.gt]: 0 } } });

        // If no slot exists with timePeriod > 0, decrement gym.complete by 20
        
    
        res.json({ message: 'Slot timePeriod updated successfully' });
    } catch (error) {
        console.error('Error updating slot:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



exports.disableSlot = async (req, res) => {
    try {
        const { id } = req.params; // Slot ID from request params
        const token = req.headers['auth']; // Get JWT token from headers
        const disableEnable = parseInt(req.body.enable);

        // Check if the token is provided
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify and decode the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Ensure the token contains valid user information
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Fetch the slot based on the ID
        const slot = await Slot.findByPk(id);
        if (!slot) {
            return res.status(404).json({ error: 'Slot not found' });
        }

        // Update the `timePeriod` of the slot to 0
        if (slot.timePeriod !== disableEnable) {
            await slot.update({ timePeriod: disableEnable });
        }

        // Check if there are any remaining active slots (`timePeriod > 0`) for the same gym
        

        // If no active slots remain, decrement `complete` by 20 for the gym
        res.json({ message: `Slot successfully  ${(disableEnable == 0) ? "disabled" : "enabled"}` });
    } catch (error) {
        console.error('Error disabling slot:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

