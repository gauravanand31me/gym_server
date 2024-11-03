'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Gyms', 'bankAccountName', {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'Name on the bank account',
    });
    await queryInterface.addColumn('Gyms', 'bankAccountNumber', {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'Bank account number',
    });
    await queryInterface.addColumn('Gyms', 'bankIFSC', {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'IFSC code for the bank',
    });
    await queryInterface.addColumn('Gyms', 'bankName', {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'Bank name',
    });
    await queryInterface.addColumn('Gyms', 'bankBranch', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Branch name of the bank',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Gyms', 'bankAccountName');
    await queryInterface.removeColumn('Gyms', 'bankAccountNumber');
    await queryInterface.removeColumn('Gyms', 'bankIFSC');
    await queryInterface.removeColumn('Gyms', 'bankName');
    await queryInterface.removeColumn('Gyms', 'bankBranch');
  }
};
