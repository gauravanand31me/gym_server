const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { Gym, Slot, Subscription } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';
const { Op } = require('sequelize');


exports.updateSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const {  price } = req.body; // Slot ID and the updated price
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

        // Validate input
        if (!id || price === undefined) {
            return res.status(400).json({ error: 'Missing required fields: id or price' });
        }

        // Fetch the slot to ensure it exists and belongs to the correct gym
        const slot = await Slot.findOne({ where: { id, gymId } });
        if (!slot) {
            return res.status(404).json({ error: 'Slot not found or does not belong to this gym' });
        }

        // Update the slot price
        await slot.update({ price });

        // Update subscription prices based on the updated slot price
        const subscription = await Subscription.findOne({ where: { gymId } });

        if (subscription) {
            // Calculate updated prices based on the new slot price
            const dailyPrice = price;
            const monthlyPrice = dailyPrice * 30; // Example: 30x daily price for monthly
            const yearlyPrice = dailyPrice * 365; // Example: 365x daily price for yearly

            // Update subscription with new minimum prices
            await subscription.update({
                daily: Math.min(subscription.daily, dailyPrice),
                monthly: Math.min(subscription.monthly, monthlyPrice),
                yearly: Math.min(subscription.yearly, yearlyPrice),
            });
        }

        res.status(200).json({ message: 'Slot price updated and subscription adjusted successfully' });
    } catch (error) {
        console.error('Error updating slot price and subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
