const nodemailer = require('nodemailer');
console.log("process.env.GODADDY_EMAIL", process.env.GODADDY_EMAIL);
console.log("process.env.GODADDY_PASS", process.env.GODADDY_PASS);
const transporter = nodemailer.createTransport({
service: 'Godaddy',
  host: 'smtpout.secureserver.net', // GoDaddy SMTP server
  port: 465, // Use 465 for SSL or 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.GODADDY_EMAIL, // GoDaddy email address
    pass: process.env.GODADDY_PASS // GoDaddy email password
  }
});

// Verify the connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Error connecting to email server:', error);
  } else {
    console.log('Server is ready to take messages');
  }
})