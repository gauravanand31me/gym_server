const transporter = require("./transporter"); // Import the transporter configuration

/**
 * Sends an email with the specified subject, body, and recipient email.
 * 
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} body - The HTML body content of the email.
 * @returns {Promise<boolean>} - Returns true if the email is sent successfully, false otherwise.
 */
const sendCustomEmail = async (email, subject, body) => {
  const logoUrl = "https://yupluck.com/static/media/logo3.b510b307d6f836b0566a.png";

  // Email HTML template
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      <div style="text-align: center; padding-bottom: 20px;">
        <img src="${logoUrl}" alt="Yupluck Logo" style="max-width: 150px;">
      </div>
      <h2 style="color: #4CAF50; text-align: center;">${subject}</h2>
      ${body}
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; line-height: 1.5; color: #aaa; text-align: center;">
        Need help? Contact our support team at 
        <a href="mailto:support@yupluck.com" style="color: #4CAF50; text-decoration: none;">contact@yupluck.com</a>.
      </p>
      <div style="text-align: center; padding-top: 20px;">
        <p style="font-size: 12px; color: #aaa;">
          © ${new Date().getFullYear()} Yupluck. All rights reserved.
        </p>
      </div>
    </div>
  `;

  // Mail options
  const mailOptions = {
    from: "Contact@yupluck.com",
    to: email, // Recipient's email
    cc: "Contact@yupluck.com", // Add CC email address(es) here
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendCustomEmail;
