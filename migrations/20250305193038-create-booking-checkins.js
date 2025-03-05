'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BookingCheckins', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      bookingId: {
        type: Sequelize.STRING,    // This is the `stringBookingId` from your Booking table
        allowNull: false,
      },
      checkinDate: {
        type: Sequelize.DATEONLY,   // Just the date (YYYY-MM-DD)
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,    // Duration in minutes or hours (up to your design)
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Add a unique constraint to prevent duplicate check-ins for the same booking on the same day
    await queryInterface.addConstraint('BookingCheckins', {
      fields: ['bookingId', 'checkinDate'],
      type: 'unique',
      name: 'unique_booking_checkin_per_day'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BookingCheckins');
  }
};
