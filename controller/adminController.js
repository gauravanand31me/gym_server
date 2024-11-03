// controllers/adminController.js
const { Gym, GymImage, Equipment, Slot, Subscription } = require('../models');

exports.adminDashboard = async (req, res) => {
  try {
    // Fetch all gyms and their associated data
    const gyms = await Gym.findAll({
      include: [
        { model: GymImage, as: 'GymImages' },  // Use the correct alias here
        { model: Equipment, as: 'Equipment' },
        { model: Slot, as: 'Slot' },
        { model: Subscription, as: 'Subscription' }
      ]
    });

    // If no gyms found
    if (!gyms || gyms.length === 0) {
      return res.status(404).json({ message: 'No gyms found' });
    }

    // Send the complete gym information
    res.json({ status: true, gyms });
  } catch (error) {
    console.error('Error fetching gym information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
