const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { GymImage, Gym } = require('../models'); // Adjust the path as needed
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const {sequelize} = require("../models/index");
const loginController = require('../controller/login');
const registerController = require('../controller/register');
const fetchController = require('../controller/fetchGym');
const updateController = require('../controller/modifyGymDetails');
const { addEquipment } = require('../controller/addEquipment');
const { deleteEquipment } = require('../controller/deleteEquipment');
const { updateEquipment } = require('../controller/updateEquipment');
const { getEquipment } = require('../controller/getEquipment');
const { addSlot } = require('../controller/addSlots');
const { getSlots } = require('../controller/getSlots');
const { deleteSlot, disableSlot } = require('../controller/deleteSlot');
const { updateSlot } = require('../controller/updateSlot');
const { getSubscription } = require('../controller/getSubscription');
const { modifySubscription } = require('../controller/modifySubscription');
const { getAllEquipmentList } = require('../controller/getAllEquipmentList');
const upload = require('../middleware/upload');
const { getAllBookingsToGym } = require('../controller/getAllBookingGym');
const { verifyBooking } = require('../controller/verifyBooking');
const BankAccountController = require('../controller/bankAccountController');
const { adminDashboard } = require('../controller/adminController');
const { informGymOwner } = require('../controller/informGymOwner');

router.post('/register', registerController.registerGym);
router.post('/login', loginController.login);
router.post('/ui/login', loginController.adminLogin);
router.post('/send-verify-link', loginController.sendVerificationLink);
router.get('/verify-email', loginController.verifyEmailPage);
router.get('/reset-password', loginController.resetPassword);
router.post('/reset-password', loginController.resetUserPassword);
router.post('/send-password-reset-link', loginController.sendPasswordResetLink);
router.get('/fetch', fetchController.fetchGym);
router.put('/update', updateController.updateGymDetails);
router.post('/equipment', addEquipment);
router.delete('/equipment/:id', deleteEquipment);
router.put('/equipment/:id', updateEquipment);
router.get('/equipment', getEquipment);
router.post('/slots', addSlot);
router.get('/slots', getSlots);
router.delete('/slots/:id', deleteSlot);
router.put('/slots/disable/:id', disableSlot);
router.put('/slots/:id', updateSlot);
router.get('/subscriptions', getSubscription);
router.put('/subscriptions', modifySubscription);
router.get('/equipments/list', getAllEquipmentList);
router.get('/booking', getAllBookingsToGym);
router.get('/booking/verify', verifyBooking);
router.post('/banking/add', BankAccountController.createBankAccount);
router.put('/banking/update', BankAccountController.updateBankAccount);
router.get('/banking/get', BankAccountController.getBankAccount);
router.post('/banking/send-verification-code', BankAccountController.sendVerificationCode);
router.post('/banking/make_payment', BankAccountController.makePayment);
router.get('/banking/get_payment', BankAccountController.getPayments);
router.post('/banking/complete_profile', BankAccountController.completeProfile);
router.post('/inform', informGymOwner);
router.post('/resetpassword', loginController.resetExtPassword);
router.post('/resetemail', loginController.resetExtEmail);

const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';

const requireAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    next(); // User is authenticated, proceed to the next handler
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};





router.get("/admin", (req, res) => {
  res.render("index"); // Renders the 'admin-login' Jade template
});


router.get("/admin/dashboard", requireAdmin, async (req, res) => {
  try {
    const email = process.env.GODADDY_EMAIL;
    const password = process.env.GODADDY_PASS;

    if (!email || !password) {
      return res.status(500).send("Required environment variables are not set.");
    }

    // Generate JWT token
    const token = jwt.sign(
      { email, password }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    // Fetch gyms data
    const gyms = await adminDashboard();
    console.log("All gyms", gyms);

    // Pass gyms data and token to the Jade/Pug template
    res.render("admin-dashboard", { gyms, token });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send("An error occurred while loading the admin dashboard.");
  }
});


router.get("/admin/email", requireAdmin, async (req, res) => {
  try {
    const email = process.env.GODADDY_EMAIL;
    const password = process.env.GODADDY_PASS;

    if (!email || !password) {
      return res.status(500).send("Required environment variables are not set.");
    }

    // Generate JWT token
    const token = jwt.sign(
      { email, password }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    // Fetch gyms data
    const gyms = await adminDashboard();
    console.log("All gyms", gyms);

    // Pass gyms data and token to the Jade/Pug template
    res.render("admin-email", { gyms, token });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send("An error occurred while loading the admin dashboard.");
  }
});

// Approve gym
router.get('/admin/approve/:gymId', requireAdmin, async (req, res) => {
  try {
    const { gymId } = req.params;
    const gym = await Gym.findByPk(gymId);

    if (!gym) {
      return res.status(404).send('Gym not found');
    }

    // Set the gym's approval status to true
    await gym.update({ verified: true });
    res.redirect('/gym/api/admin/dashboard'); // Redirect back to the dashboard
  } catch (error) {
    console.error('Error approving gym:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get("/admin/users/get", requireAdmin, async (req, res) => {
  try {
    const query = `
        SELECT 
            "Users".id AS "userId",
            "Users".full_name AS "userFullName",
            "Users".mobile_number AS "userMobileNumber"
        FROM "Users"
        ORDER BY "Users".full_name ASC;
    `;

    const users = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });

    return res.render("users", {users})
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Disapprove gym
router.get('/admin/disapprove/:gymId', requireAdmin, async (req, res) => {
  try {
    const { gymId } = req.params;
    const gym = await Gym.findByPk(gymId);

    if (!gym) {
      return res.status(404).send('Gym not found');
    }

    // Set the gym's approval status to false
    await gym.update({ verified: false });
    res.redirect('/gym/api/admin/dashboard'); // Redirect back to the dashboard
  } catch (error) {
    console.error('Error disapproving gym:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.GODADDY_EMAIL && password === process.env.GODADDY_PASS) {

    req.session.isAdmin = true;
    res.status(200).json({ status: true });
  } else {
    res.status(400).json({ status: false });
  }
});




router.post('/auth/verify-token', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }
    // If token is valid, return a success response
    res.status(200).json({ message: 'Token is valid', decoded });
  });
})




// Middleware to verify JWT and extract gymId
const verifyJWT = (req, res, next) => {
  const token = req.headers['auth'];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.gymId = decoded.id; // Attach gymId to request object
    next();
  });
};

// API to upload multiple images for a gym
router.post('/gym-images', verifyJWT, upload.array('images', 10), async (req, res) => {
  // Accept up to 10 images; adjust the limit as needed
  try {
    const { gymId } = req;

    // Ensure gym exists
    const gym = await Gym.findByPk(gymId);
    if (!gym) return res.status(404).json({ error: 'Gym not found' });

    // Get the image URLs from the uploaded files
    const imageUrls = req.files.map(file => file.location); // Assuming `file.location` contains the URL of the uploaded image



    const existingImage = await GymImage.findOne({ where: { gymId } });

    // If no images exist, increment gym.complete by 10
    if (!existingImage) {
      await Gym.increment('complete', { by: 10, where: { id: gymId } });
    }

    // Save each image URL to the database
    const imagePromises = imageUrls.map(async (url) => {
      // Check if the image already exists for the gym
      const existingImage = await GymImage.findOne({
        where: { imageUrl: url, gymId },
      });

      if (!existingImage) {
        // Create a new image entry if it doesn't exist
        return GymImage.create({ id: uuidv4(), imageUrl: url, gymId });
      }

      // Return null or any value to indicate no action was taken
      return null;
    });

    await Promise.all(imagePromises);

    res.status(201).json({ message: 'Images uploaded successfully', imageUrls });
  } catch (error) {
    console.log('Error uploading images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// API to get images for a specific gym
router.get('/gym-images', verifyJWT, async (req, res) => {
  try {
    const { gymId } = req;
    const images = await GymImage.findAll({ where: { gymId } });
    console.log("All Images list", images);
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to delete an image
router.delete('/gym-images/:imageId', verifyJWT, async (req, res) => {
  try {
    const { gymId } = req;
    const imageId = req.params.imageId;
    const image = await GymImage.findOne({ where: { id: imageId, gymId } });

    if (!image) return res.status(404).json({ error: 'Image not found' });

    // Delete the image file from the server
    const filePath = path.join(__dirname, '../public/uploads', path.basename(image.imageUrl));
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    // Delete the image record from the database
    await GymImage.destroy({ where: { id: imageId } });

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;



