'use strict';

module.exports = (sequelize, DataTypes) => {
  const AdminPayment = sequelize.define(
    'AdminPayments',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      gym_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Gyms', // Assumes a 'Gyms' model exists
          key: 'id',
        },
      },
      amount_paid: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paid_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'AdminPayments', // Explicit table name
      timestamps: true, // Enable createdAt and updatedAt
    }
  );

  AdminPayment.associate = function (models) {
    AdminPayment.belongsTo(models.Gym, {
      foreignKey: 'gymId',
      as: 'gym',
    });
  };

  return AdminPayment;
};
