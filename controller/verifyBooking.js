
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const {sequelize} = require("../models/index");
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';
const moment = require("moment");
exports.verifyBooking = async (req, res) => {
    const token = req.headers['auth']; // Get JWT token from headers
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
        return res.status(401).json({ error: 'Invalid token' });
    }




  try {
    const { bookingId } = req.query;


    const currentDate = moment().format('YYYY-MM-DD');
    const bookingDate = moment(booking.bookingDate).format('YYYY-MM-DD');

    const date = new Date(bookingDate);
    date.setHours(date.getHours() + 5, date.getMinutes() + 30);
    

    const cur_date = new Date(currentDate);
    cur_date.setHours(cur_date.getHours() + 5, cur_date.getMinutes() + 30);
    

    
    // Step 1: Fetch the booking details by bookingId using raw SQL
    const [booking] = await sequelize.query(
      'SELECT * FROM "Booking" WHERE "stringBookingId" = :bookingId AND "gymId" = :gymId',
      {
        replacements: { bookingId, gymId: decoded.id  },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!booking) {
        console.log("Not found");
      return res.status(404).json({ message: 'Booking not found For this gym' });
    }


    if (moment(currentDate).isAfter(moment(bookingDate)) && booking.type === "daily") {
      await sequelize.query(
        'UPDATE "Booking" SET "isCheckedIn" = false WHERE "stringBookingId" = :bookingId',
        {
          replacements: { bookingId },
          type: sequelize.QueryTypes.UPDATE,
        }
      );
    }

    if (booking.isCheckedIn) {
        console.log("Already came");
        return res.status(400).json({ message: 'Booking has already been checked in' });
    }

    // Step 2: Check if the booking date matches the current date
   

    
    // if (formattedCurrentDate !== formattedDate) {
    //   return res.status(400).json({ message: 'Booking is not for today' });
    // }

    // Step 3: Fetch the user using their ID from the booking
    const [user] = await sequelize.query(
      'SELECT * FROM "Users" WHERE id = :userId',
      {
        replacements: { userId: booking.userId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!user) {
        console.log("No User");
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment the user's workout hours by the booking duration
    const newTotalWorkoutTime = user.total_work_out_time + booking.duration;

    // Step 4: Update the user's workout hours
    await sequelize.query(
      'UPDATE "Users" SET total_work_out_time = :totalWorkoutTime WHERE id = :userId',
      {
        replacements: {
          totalWorkoutTime: newTotalWorkoutTime,
          userId: booking.userId,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    // Step 5: Set isCheckedIn to true for this booking
    await sequelize.query(
      'UPDATE "Booking" SET "isCheckedIn" = true WHERE "stringBookingId" = :bookingId',
      {
        replacements: { bookingId },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    // Respond with success
    res.send("User Successfully verified");
  } catch (error) {
    console.error('Error in verifyBooking:', error);
    res.status(500).send("User cannot be verified");
  }



}