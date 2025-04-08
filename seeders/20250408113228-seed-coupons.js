'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('coupons', [
      {
        id: require('uuid').v4(),
        coupon_code: 'WELCOME10',
        discount_amount: 10,
        discount_type: 'percent',
        valid_from: new Date(),
        valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: require('uuid').v4(),
        coupon_code: 'FLAT50',
        discount_amount: 50.00,
        discount_type: 'cash',
        valid_from: new Date(),
        valid_to: new Date(new Date().setMonth(new Date().getMonth() + 2)),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: require('uuid').v4(),
        coupon_code: 'SAVE15',
        discount_amount: 15,
        discount_type: 'percent',
        valid_from: new Date(),
        valid_to: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: require('uuid').v4(),
        coupon_code: 'GYMLOVE',
        discount_amount: 25.00,
        discount_type: 'cash',
        valid_from: new Date(),
        valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: require('uuid').v4(),
        coupon_code: 'FITFIRST',
        discount_amount: 5,
        discount_type: 'percent',
        valid_from: new Date(),
        valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('coupons', null, {});
  }
};
