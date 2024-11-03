// migration-file-to-create-BankAccount-table.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BankAccount', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      gymId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Gyms',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      bankAccountName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Name on the bank account'
      },
      bankAccountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Bank account number'
      },
      bankIFSC: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'IFSC code for the bank'
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Bank name'
      },
      bankBranch: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Branch name of the bank'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BankAccount');
  }
};
