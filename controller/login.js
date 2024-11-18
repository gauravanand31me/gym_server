const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Gym } = require('../models'); // Assuming Gym is the model that stores gym credentials

// Secret key for JWT (should be in environment variables for production)
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Password received", password);
    
    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find gym by email
    const gym = await Gym.findOne({ where: { email } });
    
    // If no gym is found, return error
    if (!gym) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    console.log('Hashed Password in DB:', gym.password);
    
    // Check if the email is verified
    if (gym.is_email_verified !== true) {
      return res.status(403).json({ error: 'Email is not verified' });
    }

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(password, gym.password);
    console.log("passwordMatch", passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT payload
    const tokenPayload = {
      id: gym.id,
      email: gym.email,
      name: gym.name,
    };

    // Generate a JWT token
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    // Send success response with the token
    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.sendVerificationLink = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate the email input
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email is required" });
    }

    // Find the gym with the provided email
    const gym = await Gym.findOne({ where: { email } });

    if (!gym) {
      return res.status(404).json({ error: "Gym with this email does not exist" });
    }

    // Generate a new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Update the token and its expiry in the database
    await gym.update({
      token: verificationToken
    });

    // Send verification email
    sendEmail(email, verificationToken);

    return res.status(200).json({
      message: "Verification link sent successfully",
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
