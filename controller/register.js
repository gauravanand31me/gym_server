const bcrypt = require("bcrypt");
const { Gym, Equipment, Slot, Subscription, GymImage } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../config/sendEmail");
const crypto = require("crypto"); // for generating unique tokens

// Helper function to validate input
const validateInput = (req) => {
  const {
    email,
    password,
    name,
    description,
    addressLine1,
    city,
    state,
    country,
    pinCode,
    equipmentDetails,
    slotDetails,
    subscriptionPricing,
  } = req.body;

  let errors = [];

  if (!email || !email.includes("@")) errors.push("A valid email is required");
  if (!password || password.length < 6)
    errors.push("Password must be at least 6 characters long");
  if (!name) errors.push("Gym name is required");
  if (!description) errors.push("Gym description is required");
  if (!addressLine1) errors.push("Address Line 1 is required");
  if (!city) errors.push("City is required");
  if (!state) errors.push("State is required");
  if (!country) errors.push("Country is required");
  if (!pinCode) errors.push("Pin code is required");

  
  return errors;
};

exports.registerGym = async (req, res) => {
  try {
    const errors = validateInput(req);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const {
      email,
      password,
      name,
      description,
      addressLine1,
      addressLine2,
      pinCode,
      city,
      state,
      country,
      latitude,
      longitude,
      equipmentDetails,
      slotDetails,
      subscriptionPricing,
    } = req.body;

    console.log("Register Password", password);

    // Check if gym with this email already exists
    const existingGym = await Gym.findOne({ where: { email } });
    if (existingGym) {
      return res
        .status(409)
        .json({ error: "Gym with this email already exists" });
    }

    // Create Gym entry
    const gym = await Gym.create({
      email: email.toLowerCase(),
      password,
      name,
      description,
      addressLine1,
      addressLine2,
      pinCode,
      city,
      state,
      country,
      latitude,
      longitude,
      verified: false,
      is_email_verified: false,
      token: verificationToken,
      token_expires: "5m",
      complete: 20
    });

    await GymImage.create({
      id: uuidv4(),
      imageUrl:
        "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png",
      gymId: gym.id,
    });

    sendEmail(email, verificationToken);

    return res
      .status(201)
      .json({ message: "Gym registered successfully", gym });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: error.errors.map((e) => e.message) });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
