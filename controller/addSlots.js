const jwt = require('jsonwebtoken');
const { Gym, Slot, Subscription } = require('../models');
const { v4: uuidv4 } = require('uuid');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';

exports.addSlot = async (req, res) => {
    try {
        const { capacity, price, startTime, timePeriod } = req.body; // Include all required fields
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
        if (capacity === undefined || price === undefined || !timePeriod || !gymId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Fetch the gym to ensure it exists
        const gym = await Gym.findByPk(gymId);
        if (!gym) {
            return res.status(404).json({ error: 'Gym not found' });
        }

        const existingSlot = await Slot.findOne({ where: { gymId } });

        // If no slot exists, update gym.complete by adding 10
        if (!existingSlot) {
            await Gym.increment('complete', { by: 10, where: { id: gymId } });
        }

        // Create new slot entry
        await Slot.create({
            id: uuidv4(),
            capacity,
            price,
            startTime, // Include startTime if needed
            timePeriod, // Ensure timePeriod is included and is an integer
            gymId,
        });

        // Update subscription based on the minimum slot price
        const subscription = await Subscription.findOne({ where: { gymId } });

        const minSlotPrice = await Slot.min('price', { where: { gymId } });

        // Calculate subscription prices based on the minimum slot price
        const dailyPrice = minSlotPrice;
        const monthlyPrice = dailyPrice * 30; // Example: 30x daily price for monthly
        const yearlyPrice = dailyPrice * 365; // Example: 365x daily price for yearly;

        if (!subscription) {
            // Create a new subscription if one doesn't exist
            await Subscription.create({
                id: uuidv4(),
                daily: dailyPrice,
                monthly: monthlyPrice,
                yearly: yearlyPrice,
                gymId,
            });

            await Gym.increment('complete', { by: 10, where: { id: gymId } });
        } else {
            // Update the existing subscription with the new prices
            await subscription.update({
                daily: dailyPrice,
                monthly: monthlyPrice,
                yearly: yearlyPrice,
            });
        }

        res.status(201).json({ message: 'Slot added and subscription updated successfully' });
    } catch (error) {
        console.error('Error adding slot and updating subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
