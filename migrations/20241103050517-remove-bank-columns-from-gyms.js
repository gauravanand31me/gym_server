// migration-file-to-remove-bank-columns.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Gyms', 'bankAccountName');
    await queryInterface.removeColumn('Gyms', 'bankAccountNumber');
    await queryInterface.removeColumn('Gyms', 'bankIFSC');
    await queryInterface.removeColumn('Gyms', 'bankName');
    await queryInterface.removeColumn('Gyms', 'bankBranch');
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add the columns with the same properties if you need to roll back
    await queryInterface.addColumn('Gyms', 'bankAccountName', {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'Name on the bank account',
      defaultValue: 'N/A',
    });
    await queryInterface.addColumn('Gyms', 'bankAccountNumber', {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'Bank account number',
      defaultValue: 'N/A',
    });
    await queryInterface.addColumn('Gyms', 'bankIFSC', {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'IFSC code for the bank',
      defaultValue: 'N/A',
    });
    await queryInterface.addColumn('Gyms', 'bankName', {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'Bank name',
      defaultValue: 'N/A',
    });
    await queryInterface.addColumn('Gyms', 'bankBranch', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Branch name of the bank',
      defaultValue: 'N/A',
    });
  }
};
