'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.UUID,
        autoIncrement: true,
        primaryKey: true
      },
      coupon_code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      discount_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      discount_type: {
        type: Sequelize.ENUM('cash', 'percent'),
        allowNull: false
      },
      gym_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Gyms', // assumes a 'gyms' table already exists
          key: 'id'
        },
        onDelete: 'SET NULL',
        allowNull: true
      },
      valid_from: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      valid_to: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('coupons');
  }
};
