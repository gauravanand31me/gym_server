const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,  // Your Gmail email address
    pass: process.env.GMAIL_PASS    // Your Gmail app-specific password
  }
});

// Verify the connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Error connecting to email server:', error);
  } else {
    console.log('Server is ready to take messages');
  }
});

module.exports = transporter;