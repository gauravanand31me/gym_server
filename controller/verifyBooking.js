const jwt = require('jsonwebtoken');
const { sequelize } = require("../models/index");
const JWT_SECRET = process.env.JWT_SECRET || 'Testing@123';

exports.verifyBooking = async (req, res) => {
    const token = req.headers['auth'];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    try {
        const { bookingId } = req.query;

        // Fetch booking
        const [booking] = await sequelize.query(
            'SELECT * FROM "Booking" WHERE "stringBookingId" = :bookingId AND "gymId" = :gymId',
            {
                replacements: { bookingId, gymId: decoded.id },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found for this gym' });
        }

        // Fetch user
        const [user] = await sequelize.query(
            'SELECT * FROM "Users" WHERE id = :userId',
            {
                replacements: { userId: booking.userId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get today's date in YYYY-MM-DD format (no moment needed)
        const today = new Date().toISOString().split('T')[0];  // This gives "YYYY-MM-DD"

        // For non-daily bookings (monthly, quarterly, etc.)

        // Check if there's already a check-in for today
        const [existingCheckIn] = await sequelize.query(
            'SELECT * FROM "BookingCheckins" WHERE "bookingId" = :bookingId AND "checkinDate" = :today',
            {
                replacements: { bookingId: booking.stringBookingId, today },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (existingCheckIn) {
            return res.status(400).json({ message: 'User already checked in today' });
        }

        // Insert a new check-in for today
        await sequelize.query(
            'INSERT INTO "BookingCheckins" ("bookingId", "checkinDate", "duration") VALUES (:bookingId, :today, :duration)',
            {
                replacements: { bookingId: booking.stringBookingId, today, duration: booking.duration },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        // Update user total workout time



        // For daily bookings
        if (booking.isCheckedIn) {
            return res.status(400).json({ message: 'Booking has already been checked in' });
        }

        // Normal daily booking check-in
        const newTotalWorkoutTime = user.total_work_out_time + booking.duration;
        await sequelize.query(
            'UPDATE "Users" SET total_work_out_time = :totalWorkoutTime WHERE id = :userId',
            {
                replacements: { totalWorkoutTime: newTotalWorkoutTime, userId: booking.userId },
                type: sequelize.QueryTypes.UPDATE,
            }
        );


        if (booking.type === "daily") {
            await sequelize.query(
                'UPDATE "Booking" SET "isCheckedIn" = true WHERE "stringBookingId" = :bookingId',
                {
                    replacements: { bookingId },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );
        } else {
            const timeFrames = {
                monthly: 1,
                quarterly: 3,
                halfyearly: 6,
                yearly: 12,
            };

            if (timeFrames[booking.type]) {
                const requiredDate = new Date(booking.bookingDate);
                requiredDate.setMonth(requiredDate.getMonth() + timeFrames[booking.type]);

                const currentDate = new Date();

                if (currentDate >= requiredDate) {
                    await sequelize.query(
                        'UPDATE "Booking" SET "isCheckedIn" = true WHERE "stringBookingId" = :bookingId',
                        {
                            replacements: { bookingId },
                            type: sequelize.QueryTypes.UPDATE,
                        }
                    );
                }
            }
        }


        res.send("User successfully verified");
    } catch (error) {
        console.error('Error in verifyBooking:', error);
        res.status(500).send("User cannot be verified");
    }
};
