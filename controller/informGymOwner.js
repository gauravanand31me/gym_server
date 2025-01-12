const sendCustomEmail = require("../config/sendCustomEmail");


exports.informGymOwner = async (req, res) => {
  const { email, subject, body } = req.body; // Extract email details from the request body

  if (!email || !subject || !body) {
    return res.status(400).json({
      success: false,
      message: "Email, subject, and message body are required.",
    });
  }

  try {
    // Send the email
    const emailSent = await sendCustomEmail(email, subject, body);

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: "Email sent successfully to the gym owner.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error in informGymOwner:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the email.",
      error: error.message,
    });
  }
};