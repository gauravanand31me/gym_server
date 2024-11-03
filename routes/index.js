const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { GymImage, Gym } = require('../models'); // Adjust the path as needed
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
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
const { deleteSlot } = require('../controller/deleteSlot');
const { getSubscription } = require('../controller/getSubscription');
const { modifySubscription } = require('../controller/modifySubscription');
const { getAllEquipmentList } = require('../controller/getAllEquipmentList');
const upload = require('../middleware/upload');
const { getAllBookingsToGym } = require('../controller/getAllBookingGym');
const { verifyBooking } = require('../controller/verifyBooking');
const BankAccountController = require('../controller/bankAccountController');
const { adminDashboard } = require('../controller/adminController');

router.post('/register', registerController.registerGym);
router.post('/login', loginController.login);
router.get('/fetch', fetchController.fetchGym);
router.put('/update', updateController.updateGymDetails);
router.post('/equipment', addEquipment);
router.delete('/equipment/:id', deleteEquipment);
router.put('/equipment/:id', updateEquipment);
router.get('/equipment', getEquipment);
router.post('/slots', addSlot);
router.get('/slots', getSlots);
router.delete('/slots/:id', deleteSlot);
router.get('/subscriptions', getSubscription);
router.put('/subscriptions', modifySubscription);
router.get('/equipments/list', getAllEquipmentList);
router.get('/booking', getAllBookingsToGym);
router.get('/booking/verify', verifyBooking);
router.post('/banking/add', BankAccountController.createBankAccount);
router.put('/banking/update', BankAccountController.updateBankAccount);
router.get('/banking/get', BankAccountController.getBankAccount);

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
  const gyms = await adminDashboard();

  

  // Render the Jade template with gyms data
  res.render("admin-dashboard", { gyms });
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
    res.redirect('/gym/api/admin/dashboard/admin/dashboard'); // Redirect back to the dashboard
  } catch (error) {
    console.error('Error approving gym:', error);
    res.status(500).send('Internal Server Error');
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
    res.redirect('/gym/api/admin/dashboard/admin/dashboard'); // Redirect back to the dashboard
  } catch (error) {
    console.error('Error disapproving gym:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post("/admin/login", (req, res) => {
    const {username, password} = req.body;

    if (username === process.env.GODADDY_EMAIL && password === process.env.GODADDY_PASS) {

      req.session.isAdmin = true;
      res.status(200).json({status: true});
    } else {
      res.status(400).json({status: false});
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

    // Save each image URL to the database
    const imagePromises = imageUrls.map(url =>
      GymImage.create({ id: uuidv4(), imageUrl: url, gymId })
    );
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



