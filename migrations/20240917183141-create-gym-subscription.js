'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Subscriptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      gymId: {
        type: Sequelize.UUID,
        references: {
          model: 'Gyms',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      daily: Sequelize.DECIMAL(10, 2),
      monthly: Sequelize.DECIMAL(10, 2),
      yearly: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.dropTable('Subscriptions');
  }
};
