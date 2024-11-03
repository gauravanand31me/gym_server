// controllers/BankAccountController.js
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { Gym, BankAccount } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';
const { v4: uuidv4 } = require('uuid');

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
      await Gym.increment('complete', { by: 30, where: { id: gymId } });
      res.status(201).json(bankAccount);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
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


      const { bankAccountName, bankAccountNumber, bankIFSC, bankName, bankBranch } = req.body;

      // Find the existing bank account by gymId
      const bankAccount = await BankAccount.findOne({ where: { gymId } });
      if (!bankAccount) {
        return res.status(404).json({ message: 'Bank account not found' });
      }

      // Update the bank account details
      await bankAccount.update({
        bankAccountName,
        bankAccountNumber,
        bankIFSC,
        bankName,
        bankBranch
      });

      res.status(200).json(bankAccount);
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



