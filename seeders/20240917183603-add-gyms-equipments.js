'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    

    await queryInterface.bulkInsert('Equipment', [{
      id: uuidv4(),
      gymId: "47098957-494e-476d-b8f2-4e242e2634f0",
      name: 'Treadmill',
      quantity: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      gymId: "47098957-494e-476d-b8f2-4e242e2634f0",
      name: 'Dumbbells',
      quantity: 20,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      gymId: "d6b97aa6-99b6-42d9-b4bb-9d1d9bc7f63c",
      name: 'Stationary Bike',
      quantity: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Equipment', null, {});
  }
};
