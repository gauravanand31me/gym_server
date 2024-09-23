const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const { EquipmentList } = require("../models")
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';
const { v4: uuidv4 } = require('uuid');

exports.getAllEquipmentList = async (req, res) => {
    try {
      
        const token = req.headers['auth']; // Get JWT token from headers

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Decode the JWT token
        const decoded = jwt.verify(token, JWT_SECRET); // Replace process.env.JWT_SECRET with your secret key

        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Invalid token' });
        }

   
        const equipmentList = await EquipmentList.findAll();
        res.json(equipmentList);
 
    
       

       
    } catch (error) {
        console.error('Error adding equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}