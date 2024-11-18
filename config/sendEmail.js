const express = require("express");
const router = express.Router();

const transporter = require("./transporter"); // transporter configuration from above

exports.sendEmail = async (email, token, type="nothing") => {

  
  // Generate a unique token (store this in your database with an expiry time)


  // Generate verification link
  const verificationLink = (type === "reset-password")? `https://yupluck.com/gym/api/reset-password?token=${token}&email=${email}` : `https://yupluck.com/gym/api/verify-email?token=${token}&email=${email}`;

  // Save the token and email in your database, associated with the user

  // Create the email options
  const mailOptions = {
    from: "Contact@yupluck.com",
    to: email,
    subject: "🌟 Verify Your Email Address - Welcome to Yupluck!",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
        <div style="text-align: center; padding-bottom: 20px;">
          <img src="https://yourcompany.com/logo.png" alt="Yupluck Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #4CAF50; text-align: center;">Welcome to Yupluck! 🎉</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #555; text-align: center;">
          Thank you for joining us! We’re thrilled to have you on board. To get started, please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
            Verify Email Address
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.5; color: #777; text-align: center;">
          If you did not create an account with Yupluck, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; line-height: 1.5; color: #aaa; text-align: center;">
          Need help? Contact our support team at 
          <a href="mailto:support@yupluck.com" style="color: #4CAF50; text-decoration: none;">support@yupluck.com</a>.
        </p>
        <div style="text-align: center; padding-top: 20px;">
          <p style="font-size: 12px; color: #aaa;">
            © ${new Date().getFullYear()} Yupluck. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };
  

  // Send the email
  try {
    console.log("transporter", transporter);
    await transporter.sendMail(mailOptions);
    return true
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

