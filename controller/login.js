const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Gym } = require('../models'); // Assuming Gym is the model that stores gym credentials
const crypto = require("crypto"); // for generating unique tokens
const { sendEmail } = require('../config/sendEmail');
// Secret key for JWT (should be in environment variables for production)
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
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
    const gym = await Gym.findOne({ where: { email: email.toLowerCase() } });

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







exports.sendPasswordResetLink = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate the email input
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email is required" });
    }

    
    // Find the gym with the provided email
    const gym = await Gym.findOne({ where: { email: email.toLowerCase() } });

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
    sendEmail(email, verificationToken, "reset-password");

    return res.status(200).json({
      message: "Verification link sent successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.verifyEmailPage = async (req, res) => {
  try {
    const { token, email } = req.query;

    // Validate the inputs
    if (!token || !email || !email.includes("@")) {
      return res.send(`
        <html>
          <head>
            <title>Email Verification</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(to right, #ff9966, #ff5e62); color: #fff; }
              .container { background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); display: inline-block; color: #333; }
              h1 { color: #ff5e62; }
              p { font-size: 18px; }
              .error { color: red; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Email Verification</h1>
              <p class="error">Invalid or missing token and email.</p>
            </div>
          </body>
        </html>
      `);
    }

    // Find the gym record by email
    const gym = await Gym.findOne({ where: { email } });

    if (!gym) {
      return res.send(`
        <html>
          <head>
            <title>Email Verification</title>
          </head>
          <body>
            <div class="container">
              <h1>Email Verification</h1>
              <p class="error">No gym found with this email.</p>
            </div>
          </body>
        </html>
      `);
    }

    // Check if the token matches and if it has expired
    const currentTime = new Date();
    const tokenExpires = currentTime.setMinutes(currentTime.getMinutes() + 5);
    
    if (gym.token !== token) {
      return res.send(`
        <html>
          <body>
            <div class="container">
              <h1>Email Verification</h1>
              <p class="error">Invalid token.</p>
            </div>
          </body>
        </html>
      `);
    }

    if (tokenExpires < currentTime) {
      return res.send(`
        <html>
          <body>
            <div class="container">
              <h1>Email Verification</h1>
              <p class="error">Token has expired. Please request a new verification email.</p>
            </div>
          </body>
        </html>
      `);
    }

    // Update the gym's `is_email_verified` status and clear the token
    await gym.update({
      is_email_verified: true,
      token: null,
      token_expires: null,
    });

    return res.send(`
      <html>
        <head>
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(to right, #36d1dc, #5b86e5); color: #fff; }
            .container { background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); display: inline-block; color: #333; }
            h1 { color: #36d1dc; }
            p { font-size: 18px; }
            .success { color: green; font-weight: bold; }
            .btn { background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; transition: 0.3s; display: inline-block; margin-top: 15px; }
            .btn:hover { background-color: #218838; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Email Verification</h1>
            <p class="success">Your email has been successfully verified!</p>
            <a class="btn" href="https://yupluck.com/login">Go to Login</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    return res.send(`
      <html>
        <body>
          <div class="container">
            <h1>Email Verification</h1>
            <p class="error">An error occurred while verifying your email. Please try again later.</p>
          </div>
        </body>
      </html>
    `);
  }
};



exports.resetPassword = async (req, res) => {
  // Get the query parameters from the request
  const queryParams = req.query;
  
  // Build the URL for the redirection
  const redirectUrl = `https://yupluck.com/reset-password?${new URLSearchParams(queryParams).toString()}`;

  // Perform the redirect
  return res.redirect(redirectUrl);
};

exports.adminLogin = async (req, res) => {
  const {gym_id, token} = req.body;

  console.log("Request body", req.body);

  const decoded = jwt.verify(token, JWT_SECRET);

  console.log("Decoded", decoded);

    if (decoded.email === process.env.GODADDY_EMAIL && decoded.password === process.env.GODADDY_PASS) {

      const gym = await Gym.findOne({ where: { gym_unique_id:  gym_id} });
      const tokenPayload = {
        id: gym.id,
        email: gym.email,
        name: gym.name,
      };
  
      // Generate a JWT token
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({status: true, token});
    } else {
      res.status(400).json({status: false});
    }
}


exports.resetUserPassword = async (req, res) => {
  try {
    let { email, token, password, confirmPassword } = req.body;

    // Validate input
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email is required" });
    }
    if (!token) {
      return res.status(400).json({ error: "Reset token is required" });
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }
    if (password !== confirmPassword) {
      console.log("password is", password);
      console.log("confirm password is", confirmPassword);
      return res
        .status(400)
        .json({ error: "Password and confirm password must match" });
    }

    // Check if the gym exists and if the token matches
    
    const gym = await Gym.findOne({ where: { email: email.toLowerCase() } });

    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }

    if (gym.token !== token) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Token validation (e.g., check expiration time)
    const tokenIssuedAt = new Date(gym.updatedAt); // Assume `token_expires` is checked in minutes
    const currentTime = new Date();
    const tokenExpiry = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (currentTime - tokenIssuedAt > tokenExpiry) {
      return res.status(400).json({ error: "Token has expired" });
    }

    // Update the gym's password and clear the token
    await gym.update({
      password, // Assuming the model handles hashing
      token: null, // Clear the token after successful reset
    });

    return res
      .status(200)
      .json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.resetExtPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const gym = await Gym.findOne({ where: { email } });
  try {
    await gym.update({
      password, // Assuming the model handles hashing
      token: null, // Clear the token after successful reset
    });
    
    return res
        .status(200)
        .json({ message: "Password reset successfully. You can now log in." });
  }  catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  
}



exports.resetExtEmail = async (req, res) => {
  const { email } = req.body;
  const gym = await Gym.findOne({ where: { email } });
  try {
    await gym.update({
      email: email.toLowerCase(), // Assuming the model handles hashing
      token: null, // Clear the token after successful reset
    });
    
    return res
        .status(200)
        .json({ message: "Email reset successfully. You can now log in." });
  }  catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  
}

