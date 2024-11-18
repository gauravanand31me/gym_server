exports.sendEmail = async (email, token, type = "nothing") => {
  const logoUrl = "https://yupluck.com/static/media/logo3.b510b307d6f836b0566a.png";

  // Generate the verification link based on the type
  const verificationLink =
    type === "reset-password"
      ? `https://yupluck.com/gym/api/reset-password?token=${token}&email=${email}`
      : `https://yupluck.com/gym/api/verify-email?token=${token}&email=${email}`;

  // Determine the email content based on the type
  let emailContent = "";
  let subject = "";

  if (type === "reset-password") {
    subject = "🌟 Reset Your Password";
    emailContent = `
      <p style="font-size: 16px; line-height: 1.5; color: #555; text-align: center;">
        You requested to reset your password. Click the button below to set a new password:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 14px; line-height: 1.5; color: #777; text-align: center;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    `;
  } else if (type === "bank") {
    subject = "🔒 Update Your Bank Details";
    emailContent = `
      <p style="font-size: 16px; line-height: 1.5; color: #555; text-align: center;">
        To update your bank details, use the verification code below:
      </p>
      <div style="text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; color: #4CAF50;">
        ${token}
      </div>
      <p style="font-size: 14px; line-height: 1.5; color: #777; text-align: center;">
        If you didn’t request to update your bank details, please ignore this email.
      </p>
    `;
  } else {
    subject = "🌟 Verify Your Email Address - Welcome to Yupluck!";
    emailContent = `
      <p style="font-size: 16px; line-height: 1.5; color: #555; text-align: center;">
        Thank you for joining us! Verify your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
          Verify Email Address
        </a>
      </div>
      <p style="font-size: 14px; line-height: 1.5; color: #777; text-align: center;">
        If you didn’t create an account with Yupluck, you can safely ignore this email.
      </p>
    `;
  }

  // Email HTML template
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      <div style="text-align: center; padding-bottom: 20px;">
        <img src="${logoUrl}" alt="Yupluck Logo" style="max-width: 150px;">
      </div>
      <h2 style="color: #4CAF50; text-align: center;">${subject}</h2>
      ${emailContent}
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

  // Create the email options
  const mailOptions = {
    from: "Contact@yupluck.com",
    to: email,
    subject: subject,
    html: htmlContent,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
