'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Gyms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: Sequelize.TEXT,
      addressLine1: Sequelize.STRING,
      addressLine2: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      country: Sequelize.STRING,
      pinCode: Sequelize.STRING,
      latitude: Sequelize.DOUBLE,
      longitude: Sequelize.DOUBLE,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Gyms');
  }
};
