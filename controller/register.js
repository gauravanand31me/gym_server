const bcrypt = require('bcrypt');
const { Gym, Equipment, Slot, Subscription } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Helper function to validate input
const validateInput = (req) => {
  const { 
    email, password, name, description, addressLine1, city, state, country, pinCode, equipmentDetails, slotDetails, subscriptionPricing 
  } = req.body;

  let errors = [];

  if (!email || !email.includes('@')) errors.push('A valid email is required');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters long');
  if (!name) errors.push('Gym name is required');
  if (!description) errors.push('Gym description is required');
  if (!addressLine1) errors.push('Address Line 1 is required');
  if (!city) errors.push('City is required');
  if (!state) errors.push('State is required');
  if (!country) errors.push('Country is required');
  if (!pinCode) errors.push('Pin code is required');

  // if (equipmentDetails && equipmentDetails.length > 0) {
  //   equipmentDetails.forEach((item, index) => {
  //     if (!item.name || !item.quantity) {
  //       errors.push(`Equipment at index ${index} is missing name or quantity`);
  //     }
  //   });
  // }

  // if (slotDetails && slotDetails.length > 0) {
  //   slotDetails.forEach((slot, index) => {
  //     if (!slot.capacity || !slot.timePeriod) {
  //       errors.push(`Slot at index ${index} is missing capacity or time period`);
  //     }
  //   });
  // }

  // if (!subscriptionPricing || !subscriptionPricing.dailyPrice || !subscriptionPricing.monthlyPrice || !subscriptionPricing.yearlyPrice) {
  //   errors.push('Subscription pricing (daily, monthly, yearly) is required');
  // }

  return errors;
};

exports.registerGym = async (req, res) => {
  try {
    const errors = validateInput(req);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { 
      email, password, name, description, addressLine1, addressLine2, pinCode, city, state, country, latitude, longitude,
      equipmentDetails, slotDetails, subscriptionPricing 
    } = req.body;

    console.log("Register Password", password);

   
    // Check if gym with this email already exists
    const existingGym = await Gym.findOne({ where: { email } });
    if (existingGym) {
      return res.status(409).json({ error: 'Gym with this email already exists' });
    }

 
  

    
    // Create Gym entry
    const gym = await Gym.create({
      email,
      password,
      name,
      description,
      addressLine1,
      addressLine2,
      pinCode,
      city,
      state,
      country,
      latitude,
      longitude
    });

    // // Add Equipment details
    // if (equipmentDetails && equipmentDetails.length > 0) {
    //   for (const equipment of equipmentDetails) {
    //     await Equipment.create({
    //       id: uuidv4(),
    //       name: equipment.name,
    //       quantity: equipment.quantity,
    //       gymId: gym.id
    //     });
    //   }
    // }

    // // Add Slot details
    // if (slotDetails && slotDetails.length > 0) {
    //   for (const slot of slotDetails) {
    //     await Slot.create({
    //       id: uuidv4(),
    //       capacity: slot.capacity,
    //       timePeriod: slot.timePeriod,
    //       price: subscriptionPricing.dailyPrice, // Set price to dailyPrice
    //       gymId: gym.id
    //     });
    //   }
    // }

    // // Add Subscription Pricing
    // await Subscription.create({
    //   id: uuidv4(),
    //   dailyPrice: subscriptionPricing.dailyPrice,
    //   monthlyPrice: subscriptionPricing.monthlyPrice,
    //   yearlyPrice: subscriptionPricing.yearlyPrice,
    //   gymId: gym.id
    // });

    return res.status(201).json({ message: 'Gym registered successfully', gym });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
