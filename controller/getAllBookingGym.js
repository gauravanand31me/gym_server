const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const {sequelize} = require("../models/index");
exports.getAllBookingsToGym = async (req, res) => {
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

        const gymId = decoded.id;
  
      const query = 'SELECT \n' +
        '    "Booking"."bookingId" AS "id",\n' +
        '    "Booking"."stringBookingId" AS "bookingId",\n' +
        '    "Booking"."userId" AS "userId",\n' +
        '    "Booking"."bookingDate" AS "bookingDate",\n' +
        '    "Booking"."isCheckedIn" AS "visited",\n' +
        '    "Gyms".id AS "gymId", \n' +
        '    "Gyms".name AS "gymName",\n' +
        '    "Gyms".rating AS "gymRating",\n' +
        '    "Users".full_name AS "userFullName",\n' +
        '    "Users".mobile_number AS "userMobileNumber",\n' +
        '    "Slots"."startTime" AS "slotStartTime",\n' +
        '    "Booking".price AS "subscriptionPrice",\n' +
        '    "Booking"."isPaid" AS "isPaid",\n' +
        '    "Booking"."type" AS "bookingType",\n' +
        '    "Booking"."createdAt" AS "create",\n' +
        '    COUNT("BuddyRequests".id) AS "invitedBuddyCount"  -- Count of buddies invited\n' +
        'FROM "Booking"\n' +
        'JOIN "Slots" ON "Booking"."slotId" = "Slots".id\n' +
        'JOIN "Users" ON "Users"."id" = "Booking"."userId"\n' +
        'JOIN "Gyms" ON "Slots"."gymId" = "Gyms".id\n' +
        'JOIN "Subscriptions" ON "Slots"."gymId" = "Subscriptions"."gymId" \n' +
        'LEFT JOIN "BuddyRequests" ON "Booking"."bookingId" = "BuddyRequests"."bookingId"  -- Left join to BuddyRequests\n' +
        `WHERE "Gyms"."id" = '${gymId}'\n` +
        'GROUP BY "Booking"."bookingId", "Booking"."type", "Booking"."userId", "Booking"."bookingDate", "Booking"."isPaid", "Gyms".id, "Gyms".name, "Users".full_name, "Users".mobile_number, "Gyms".rating, "Slots"."startTime", "Subscriptions".daily\n' +  // Corrected here
        'ORDER BY "Booking"."bookingDate" DESC; -- Order by booking date';
  
      // Execute the booking query
      const [results] = await sequelize.query(query, {
        replacements: { gymId: gymId },
      });
  
      res.status(200).json({ Booking: results });
    } catch (error) {
      console.error('Error fetching Booking:', error);
      res.status(500).send('Server error');
    }
  };