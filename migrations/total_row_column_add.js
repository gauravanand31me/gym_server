'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Gyms', 'total_rating', {
      type: Sequelize.INTEGER, // Change this type according to your requirement
      allowNull: true, // Adjust based on whether this field can be null
      defaultValue: 0 // Default value if you want to set one
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Gyms', 'total_rating');
  }
};
