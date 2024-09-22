'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Slots', [{
      id: uuidv4(),
      gymId: "47098957-494e-476d-b8f2-4e242e2634f0",
      capacity: 10,
      price: 25.00,
      startTime: '06:00:00',
      timePeriod: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      gymId: "47098957-494e-476d-b8f2-4e242e2634f0",
      capacity: 15,
      price: 30.00,
      startTime: '08:00:00',
      timePeriod: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      gymId: "d6b97aa6-99b6-42d9-b4bb-9d1d9bc7f63c",
      capacity: 12,
      price: 20.00,
      startTime: '07:00:00',
      timePeriod: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Slots', null, {});
  }
};
