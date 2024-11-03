// controllers/adminController.js
const { Gym, GymImage, Equipment, Slot, Subscriptions } = require('../models');

exports.adminDashboard = async () => {
  try {
    // Fetch all gyms and their associated data
    const gyms = await Gym.findAll({
      include: [
        { model: GymImage, as: 'GymImages' },  // Use the correct alias here
        { model: Equipment, as: 'Equipment' },
        { model: Slot, as: 'Slots' },
        { model: Subscriptions, as: 'Subscription' }
      ]
    });

    // If no gyms found
    if (!gyms || gyms.length === 0) {
      return res.status(404).json({ message: 'No gyms found' });
    }

    // Send the complete gym information
    return gyms;
  } catch (error) {
    console.error('Error fetching gym information:', error);
    return error;
  }
};
