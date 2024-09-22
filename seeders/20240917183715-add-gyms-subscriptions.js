'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Subscriptions', [{
      id: uuidv4(),
      gymId: "47098957-494e-476d-b8f2-4e242e2634f0",
      daily: 5.00,
      monthly: 100.00,
      yearly: 1000.00,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      gymId: "d6b97aa6-99b6-42d9-b4bb-9d1d9bc7f63c",
      daily: 4.00,
      monthly: 80.00,
      yearly: 800.00,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Subscriptions', null, {});
  }
};
