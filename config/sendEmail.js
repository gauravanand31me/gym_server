const express = require("express");
const router = express.Router();
const crypto = require("crypto"); // for generating unique tokens
const transporter = require("./path/to/transporter"); // transporter configuration from above

exports.sendEmail = async (email) => {

  
  // Generate a unique token (store this in your database with an expiry time)
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // Generate verification link
  const verificationLink = `https://yupluck.com/verify-email?token=${verificationToken}&email=${email}`;

  // Save the token and email in your database, associated with the user

  // Create the email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Email Verification</h2>
        <p>Thank you for registering! Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 15px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thanks, <br>Your Company Team</p>
      </div>
    `,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Verification email sent." });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ message: "Failed to send verification email." });
  }
};

