'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Subscriptions', 'quarterly', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      }),
      queryInterface.addColumn('Subscriptions', 'halfYearly', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Subscriptions', 'quarterly'),
      queryInterface.removeColumn('Subscriptions', 'halfYearly'),
    ]);
  },
};
