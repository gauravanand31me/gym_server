'use strict';
const { v4: uuidv4 } = require('uuid');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch the UUIDs for the gyms
    

    await queryInterface.bulkInsert('GymImages', [{
      id: uuidv4(),
      gymId: "47098957-494e-476d-b8f2-4e242e2634f0",  // Use the UUID for Gym One
      imageUrl: 'https://example.com/image1.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      gymId: "47098957-494e-476d-b8f2-4e242e2634f0",  // Same UUID for Gym One
      imageUrl: 'https://example.com/image2.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuidv4(),
      gymId: "d6b97aa6-99b6-42d9-b4bb-9d1d9bc7f63c",  // Use the UUID for Gym Two
      imageUrl: 'https://example.com/image3.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GymImages', null, {});
  }
};
