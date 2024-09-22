// routes/gymRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { Gym, GymImage, Equipment, Slot, Subscription } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';

// Fetch all information about a single gym
exports.fetchGym = async (req, res) => {
  try {
    const token = req.headers['login_id']; // Read the JWT token from headers

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET); // Replace process.env.JWT_SECRET with your secret key
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const gymId = decoded.id; // Extract the gymId from the decoded token
    
    // Fetch gym details
    const gym = await Gym.findByPk(gymId);

    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    // Fetch associated data
    const [images, equipment, slots, subscriptions] = await Promise.all([
      GymImage.findAll({ where: { gymId } }),
      Equipment.findAll({ where: { gymId } }),
      Slot.findAll({ where: { gymId } }),
      Subscription.findAll({ where: { gymId } }),
    ]);

    // Send the complete gym information
    res.json({
      gym,
      images,
      equipment,
      slots,
      subscriptions
    });
  } catch (error) {
    console.error('Error fetching gym information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
