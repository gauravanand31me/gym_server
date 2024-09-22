const { Gym } = require('../models'); // Import Gym model
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';
// Helper function to validate the input fields
const validateUpdateInput = (body) => {
  const { name, description, addressLine1, city, state, country, pinCode, latitude, longitude } = body;
  let errors = [];

  if (name && name.length < 3) errors.push('Gym name must be at least 3 characters long');
  if (description && description.length < 10) errors.push('Gym description must be at least 10 characters long');
  if (addressLine1 && addressLine1.length < 5) errors.push('Address Line 1 must be at least 5 characters long');
  if (city && city.length < 2) errors.push('City must be at least 2 characters long');
  if (state && state.length < 2) errors.push('State must be at least 2 characters long');
  if (country && country.length < 2) errors.push('Country must be at least 2 characters long');
  if (pinCode && (pinCode.length < 5 || isNaN(pinCode))) errors.push('Pin code must be at least 5 digits long and numeric');
  if (latitude && (latitude < -90 || latitude > 90)) errors.push('Latitude must be between -90 and 90');
  if (longitude && (longitude < -180 || longitude > 180)) errors.push('Longitude must be between -180 and 180');

  return errors;
};

exports.updateGymDetails = async (req, res) => {
  try {
    const token = req.headers['auth']; // Read the JWT token from headers

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET); // Replace process.env.JWT_SECRET with your secret key
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const id = decoded.id; // Extract the gymId from the decoded token
    
    const { name, description, addressLine1, addressLine2, city, state, country, pinCode, latitude, longitude } = req.body;

    // Input validation
    const errors = validateUpdateInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors }); // Return bad request with validation errors
    }

    // Find the gym by ID
    const gym = await Gym.findOne({ where: { id } });
    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    // Update the gym details (only update fields that are provided)
    gym.name = name || gym.name;
    gym.description = description || gym.description;
    gym.addressLine1 = addressLine1 || gym.addressLine1;
    gym.addressLine2 = addressLine2 || gym.addressLine2;
    gym.city = city || gym.city;
    gym.state = state || gym.state;
    gym.country = country || gym.country;
    gym.pinCode = pinCode || gym.pinCode;
    gym.latitude = latitude || gym.latitude;
    gym.longitude = longitude || gym.longitude;

    // Save the updated gym details
    await gym.save();

    // Send success response
    return res.status(200).json({ message: 'Gym details updated successfully', gym });
  } catch (error) {
    console.error(error);

    // Handle specific Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }

    // General error handling
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
