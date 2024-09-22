const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { Gym, GymImage, Equipment, Slot, Subscription } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';
const { v4: uuidv4 } = require('uuid');

exports.modifySubscription = async (req, res) => {
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
    
       
            const { dailyPrice, monthlyPrice, yearlyPrice } = req.body;
        
            // Validate input
            if (dailyPrice === undefined || monthlyPrice === undefined || yearlyPrice === undefined) {
              return res.status(400).json({ message: 'All pricing fields are required' });
            }
        
            // Update the subscription
            const subscription = await Subscription.findOne({ where: { gymId } });

            console.log("Request body", req.body);
        
            if (!subscription) {
                await Subscription.create({
                    id: uuidv4(),
                    daily: dailyPrice,
                    monthly: monthlyPrice,
                    yearly: yearlyPrice,
                    gymId
                });
            } else {
                await subscription.update({
                    daily: dailyPrice,
                    monthly: monthlyPrice,
                    yearly: yearlyPrice,
                  });
            }
        
            
        
            res.status(200).json({ message: 'Subscription updated successfully' });
          
      } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}