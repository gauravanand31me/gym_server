// controllers/BankAccountController.js
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { Gym, BankAccount, AdminPayments} = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { sendEmail } = require('../config/sendEmail');


function generateRandomAlphanumeric(length) {
  if (length <= 0) {
    throw new Error('Length must be a positive integer.');
  }
  return crypto
    .randomBytes(length)
    .toString('base64') // Converts to a Base64 string
    .replace(/[^a-zA-Z0-9]/g, '') // Removes non-alphanumeric characters
    .slice(0, length); // Trims to the desired length
}

  // Insert a new bank account record for a specific gymId
exports.createBankAccount = async (req, res) => {
    try {
        const token = req.headers['auth']; // Get JWT token from headers

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Decode the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);

        const gymId = decoded.id;

      // Check if a bank account already exists for this gymId
      const existingAccount = await BankAccount.findOne({ where: { gymId } });
      if (existingAccount) {
        return res.status(400).json({ message: 'Bank account already exists for this gym' });
      }

      // Create the bank account with only the gymId
      const id = uuidv4();
      const bankAccount = await BankAccount.create({ id, gymId });
      await Gym.increment('complete', { by: 20, where: { id: gymId } });
      res.status(201).json(bankAccount);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

exports.completeProfile = async (req, res) => {
  const token = req.headers['auth']; // Get JWT token from headers
  console.log("Token received", token);
  const decoded = jwt.verify(token, JWT_SECRET);
  const gymId = decoded.id;
  const gym = await Gym.findOne({ where: { id: gymId } });
  gym.update({
    complete: 100
  })
  return res.status(200).json("Updated successfully");

}

  // Update the bank account details for a specific gymId
exports.updateBankAccount = async (req, res) => {
    try {
        const token = req.headers['auth']; // Get JWT token from headers

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Decode the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);

        const gymId = decoded.id;


      const { bankAccountName, bankAccountNumber, bankIFSC, bankName, bankBranch, code } = req.body;

      const gym = await Gym.findOne({ where: { id: gymId, token: code } });
      if (!gym) {
        return res.status(400).json({ message: "Invalid code or gym not found" });
      }

      // Find the existing bank account by gymId
      const bankAccount = await BankAccount.findOne({ where: { gymId } });
      const id = uuidv4();
      if (bankAccount) {
        // Update the existing bank account
        await bankAccount.update({
          bankAccountName,
          bankAccountNumber,
          bankIFSC,
          bankName,
          bankBranch,
        });

        return res.status(200).json({ message: 'Bank account updated successfully' });
      } else {
        // Create a new bank account
        const newBankAccount = await BankAccount.create({
          id,
          gymId,
          bankAccountName,
          bankAccountNumber,
          bankIFSC,
          bankName,
          bankBranch,
        });

        return res.status(200).json({ message: 'Bank account created successfully', data: newBankAccount });
      }

      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get the bank account details for a specific gymId
exports.getBankAccount = async(req, res) => {
    try {
        const token = req.headers['auth']; // Get JWT token from headers

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Decode the JWT token
        const decoded = jwt.verify(token, JWT_SECRET);

        const gymId = decoded.id;

      // Find the bank account by gymId
      const bankAccount = await BankAccount.findOne({ where: { gymId } });
      if (!bankAccount) {
        return res.status(404).json({ message: 'Bank account not found' });
      }

      res.status(200).json(bankAccount);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

exports.sendVerificationCode = async (req, res) => {
  try {
    const token = req.headers['auth']; // Get JWT token from headers

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    const gymId = decoded.id;

    const gym = await Gym.findByPk(gymId);
    if (!gym) {
        return res.status(404).json({ error: 'Gym not found' });
    }

    const randomToken = generateRandomAlphanumeric(6);
    await gym.update({
        token: randomToken, // Clear the token after successful reset
    });
    sendEmail(gym.email, randomToken, "bank");
    res.status(200).json({status: true, message: "Code has been sent successfully to your email id"});

  }

    catch (e) {

    }
}

exports.makePayment = async (req, res) => { 
  const {amount, auth} = req.body;

  const token = req.headers['auth']; // Get JWT token from headers

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    const gymId = decoded.id;

    const gym = await Gym.findByPk(gymId);
    if (!gym) {
        return res.status(404).json({ error: 'Gym not found' });
    }

  AdminPayments.create({
    gym_id: gymId,
    amount_paid: amount,
  }).then((payment) => console.log(payment));

  return res.status(200).json({status: true});
}



exports.getPayments = async (req, res) => {
  const token = req.headers['auth']; // Get JWT token from headers

  if (!token) {
      return res.status(401).json({ error: 'No token provided' });
  }

  try {
      // Decode the JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      const gymId = decoded.id;

      // Find the gym by its ID
      const gym = await Gym.findByPk(gymId);
      if (!gym) {
          return res.status(404).json({ error: 'Gym not found' });
      }

      // Fetch all payments made by the gym
      const payments = await AdminPayments.findAll({
          where: { gym_id: gymId },
          order: [['createdAt', 'DESC']]  // Optional: You can order by date of payment
      });

      // Return the payments as a response
      return res.status(200).json({ payments });
  } catch (error) {
      console.error('Error fetching payments:', error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};



