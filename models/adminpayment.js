'use strict';

module.exports = (sequelize, DataTypes) => {
  const AdminPayment = sequelize.define(
    'AdminPayment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      gymId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Gyms', // Assumes a 'Gyms' model exists
          key: 'id',
        },
      },
      amountPaid: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paidOn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'AdminPayment', // Explicit table name
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
