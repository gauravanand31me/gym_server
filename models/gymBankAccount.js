// models/bankaccount.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const BankAccount = sequelize.define('BankAccount', {
    gymId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Gyms', // Assumes a 'Gyms' model exists
        key: 'id'
      }
    },
    bankAccountName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A' // Set default value to "N/A"
    },
    bankAccountNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A' // Set default value to "N/A"
    },
    bankIFSC: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A' // Set default value to "N/A"
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A' // Set default value to "N/A"
    },
    bankBranch: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'N/A' // Set default value to "N/A"
    }
  }, {
    tableName: 'BankAccount',  // Specify the table name explicitly
    timestamps: true // Enable createdAt and updatedAt timestamps
  });

  BankAccount.associate = function(models) {
    BankAccount.belongsTo(models.Gym, {
      foreignKey: 'gymId',
      as: 'gym'
    });
  };

  return BankAccount;
};
