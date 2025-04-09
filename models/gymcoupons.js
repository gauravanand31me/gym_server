'use strict';

module.exports = (sequelize, DataTypes) => {
    const CouponGymMap = sequelize.define('CouponGymMap', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      coupon_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'coupons',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      gym_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Gyms', // or 'gyms' depending on your table name
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      }
    }, {
      tableName: 'coupon_gyms',
      timestamps: false // disable default camelCase timestamps
    });


    CouponGymMap.associate = models => {
        CouponGymMap.belongsTo(models.Coupon, {
          foreignKey: 'coupon_id'
        });
        CouponGymMap.belongsTo(models.Gym, {
          foreignKey: 'gym_id'
        });
    };
  
    return CouponGymMap;
  };
  