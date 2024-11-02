'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Gyms', 'complete', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,  // Default value as false for unverified gyms
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Gyms', 'complete');
  }
};
