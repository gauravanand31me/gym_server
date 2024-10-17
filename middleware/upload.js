// middleware/upload.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/aws');
require('dotenv').config();

console.log("Process.env", process.env.AWS_S3_BUCKET_NAME);
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        key: (req, file, cb) => {
            const gymId = req.gymId; // Assuming req.user is populated
            const fileName = `${gymId}/gym_${Date.now()}.jpg`;
            cb(null, fileName);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;