'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Gyms', 'is_email_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: true, // Can be null initially
    });
    await queryInterface.addColumn('Gyms', 'token', {
      type: Sequelize.STRING,
      allowNull: true, // Can be null
    });
    await queryInterface.addColumn('Gyms', 'token_expires', {
      type: Sequelize.STRING,
      allowNull: true, // Can be null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Gyms', 'is_email_verified');
    await queryInterface.removeColumn('Gyms', 'token');
    await queryInterface.removeColumn('Gyms', 'token_expires');
  },
};
