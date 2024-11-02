'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Gyms', 'verified', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,  // Default value as false for unverified gyms
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Gyms', 'verified');
  }
};
