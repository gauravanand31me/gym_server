const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const AWS = require('aws-sdk');
const { GymImage, Gym, Coupon, CouponGymMap } = require('../models'); // Adjust the path as needed
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
const { getAllBookingsToGym, getUniqueUsersWithLastBooking } = require('../controller/getAllBookingGym');
const { verifyBooking } = require('../controller/verifyBooking');
const BankAccountController = require('../controller/bankAccountController');
const { adminDashboard } = require('../controller/adminController');
const { informGymOwner } = require('../controller/informGymOwner');
const { sendSMS } = require('../config/sendSMS');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});



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
router.get('/customers', getUniqueUsersWithLastBooking);
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
    

    // Pass gyms data and token to the Jade/Pug template
    res.render("admin-dashboard", { gyms, token });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send("An error occurred while loading the admin dashboard.");
  }
});



router.get("/admin/coupons", requireAdmin, async (req, res) => {
  try {
    const email = process.env.GODADDY_EMAIL;
    const password = process.env.GODADDY_PASS;

    if (!email || !password) {
      return res.status(500).send("Required environment variables are not set.");
    }

    const token = jwt.sign(
      { email, password },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Fetch all coupons
    const coupons = await Coupon.findAll({});

  
    res.render("admin-coupons", { coupons, token });

  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).send("An error occurred while loading coupon data.");
  }
});





router.get("/admin/challenge", requireAdmin, async (req, res) => {
  try {
    const email = process.env.GODADDY_EMAIL;
    const password = process.env.GODADDY_PASS;

    if (!email || !password) {
      return res.status(500).send("Required environment variables are not set.");
    }

    const token = jwt.sign(
      { email, password },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Raw SQL query to fetch all challenge feeds
    const [challenges] = await sequelize.query(`
      SELECT * FROM "Feeds"
      WHERE "activityType" = 'challenge'
      ORDER BY "createdAt" DESC
    `);

    // Fetch all coupons (still using ORM)


    // Render the page with both datasets
    res.render("admin-challenges", {
      challenges,
      token
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while loading data.");
  }
});



router.get("/admin/update-price", requireAdmin, async (req, res) => {
  try {
    const code = req.query.code?.trim();
    const price = parseFloat(req.query.price);

    if (!code || isNaN(price)) {
      return res.status(400).send("Invalid code or price.");
    }

    const [result] = await sequelize.query(
      `
        UPDATE "Feeds"
        SET "price" = :price
        WHERE "randomCode" = :code
      `,
      {
        replacements: { price, code },
      }
    );

    // `result` will be metadata from the DB; check number of rows affected if needed
    res.redirect("/gym/api/admin/challenge");

  } catch (error) {
    console.error("Error updating price with raw query:", error);
    res.status(500).send("Server error.");
  }
});



router.get("/admin/deactivate-price", requireAdmin, async (req, res) => {
  try {
    const code = req.query.code?.trim();

    if (!code) {
      return res.status(400).send("Invalid code.");
    }

    const [result] = await sequelize.query(
      `
        UPDATE "Feeds"
        SET "price" = 0
        WHERE "randomCode" = :code
      `,
      {
        replacements: { code },
      }
    );

    res.redirect("/gym/api/admin/challenge");

  } catch (error) {
    console.error("Error deactivating challenge:", error);
    res.status(500).send("Server error.");
  }
});



router.get("/admin/update-award", requireAdmin, async (req, res) => {
  try {
    const code = req.query.code?.trim();
    const award = req.query.award?.trim();

    if (!code) {
      return res.status(400).send("Invalid code.");
    }

    await sequelize.query(
      `UPDATE "Feeds" SET "awards" = :award WHERE "randomCode" = :code`,
      { replacements: { award, code } }
    );

    res.redirect("/gym/api/admin/challenge");
  } catch (error) {
    console.error("Error updating award:", error);
    res.status(500).send("Server error.");
  }
});


router.get("/admin/coupons/attach", requireAdmin, async (req, res) => {
  try {
    const email = process.env.GODADDY_EMAIL;
    const password = process.env.GODADDY_PASS;
    const token = jwt.sign({ email, password }, JWT_SECRET, { expiresIn: "1h" });

    const gyms = await adminDashboard();
    const coupons = await Coupon.findAll();
    const gym_id = req.query.gym_id;

    // Fetch all mappings with joined data
    const mappings = await CouponGymMap.findAll({
      include: [
        { model: Coupon, attributes: ['coupon_code'] },
        { model: Gym, attributes: ['name', 'gym_unique_id'] }
      ]
    });

    res.render("admin-attach-coupon", { gyms, coupons, token, message: null, gym_id, mappings });
  } catch (error) {
    console.error("Error loading attach form:", error);
    res.status(500).send("Error loading form.");
  }
});



router.post("/admin/coupons/detach/:id", requireAdmin, async (req, res) => {
  try {
    await CouponGymMap.destroy({ where: { id: req.params.id } });
    res.redirect("/gym/api/admin/coupons/attach");
  } catch (err) {
    console.error("Detach error:", err);
    res.status(500).send("Failed to detach coupon.");
  }
});


router.post("/admin/coupons/add", requireAdmin, async (req, res) => {
  try {
    const {
      coupon_code,
      discount_amount,
      discount_type,
      valid_from,
      valid_to,
      is_active
    } = req.body;

    await Coupon.create({
      coupon_code,
      discount_amount,
      discount_type,
      valid_from,
      valid_to,
      is_active: is_active === 'true'
    });

    const coupons = await Coupon.findAll({ order: [['created_at', 'DESC']] });
    res.render("admin-coupons", { coupons, message: "Coupon added successfully!" });
  } catch (err) {
    console.error("Error adding coupon:", err);
    res.status(500).send("Failed to add coupon.");
  }
});


router.post("/admin/coupons/attach", requireAdmin, async (req, res) => {
  const { gym_id, coupon_id } = req.body;

  try {
    // Avoid duplicate mapping
    const existing = await CouponGymMap.findOne({ where: { gym_id, coupon_id } });

    if (!existing) {
      await CouponGymMap.create({ gym_id, coupon_id });
    }

    const gyms = await adminDashboard();
    const coupons = await Coupon.findAll();
    const message = existing ? "Already attached!" : "Coupon successfully attached to gym!";

  

    // Fetch all mappings with joined data
    const mappings = await CouponGymMap.findAll({
      include: [
        { model: Coupon, attributes: ['coupon_code'] },
        { model: Gym, attributes: ['name', 'gym_unique_id'] }
      ]
    });

    res.render("admin-attach-coupon", { gyms, coupons, token: req.token, message, gym_id,  mappings });
  } catch (error) {
    console.error("Error attaching coupon:", error);
    res.status(500).send("Failed to attach coupon.");
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


router.post('/admin/send-sms', async (req, res) => {
  const { message, numbers} = req.body;
  for (const number of numbers) {
    await sendSMS("+91"+number, message);
  }
  return res.json({ success: true, message: "SMS sent successfully to all users!" });
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

router.post('/gym-images', verifyJWT, upload.array('images', 10), async (req, res) => {
  try {
    const { gymId } = req;

    const gym = await Gym.findByPk(gymId);
    if (!gym) return res.status(404).json({ error: 'Gym not found' });

    const uploadedUrls = await Promise.all(req.files.map(async (file) => {
      const webpBuffer = await sharp(file.buffer)
        .resize({ width: 1000 }) // Optional: resize
        .webp({ quality: 80 })
        .toBuffer();

      const key = `${gymId}/gym_${Date.now()}_${uuidv4()}.webp`;

      await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: webpBuffer,
        ContentType: 'image/webp',
      }).promise();

      return `https://${process.env.CLOUDFRONT_URL}/${key}`;
    }));

    const existingImage = await GymImage.findOne({ where: { gymId } });
    if (!existingImage) {
      await Gym.increment('complete', { by: 10, where: { id: gymId } });
    }

    const imagePromises = uploadedUrls.map(async (url) => {
      const alreadyExists = await GymImage.findOne({ where: { imageUrl: url, gymId } });
      if (!alreadyExists) {
        return GymImage.create({ id: uuidv4(), imageUrl: url, gymId });
      }
      return null;
    });

    await Promise.all(imagePromises);

    res.status(201).json({ message: 'Images uploaded successfully', imageUrls: uploadedUrls });
  } catch (error) {
    console.error('Error uploading images:', error);
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



