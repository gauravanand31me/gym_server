'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('coupons', 'gym_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('coupons', 'gym_id', {
      type: Sequelize.UUID,
      references: {
        model: 'Gyms',
        key: 'id'
      },
      onDelete: 'SET NULL',
      allowNull: true
    });
  }
};
