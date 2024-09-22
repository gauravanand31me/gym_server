const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const gyms = [
  {
      email: 'info@gymone.com',
      password: 'GymOnePassword123',
      name: 'Fit Zone',
      description: 'A top-notch gym with all modern facilities and trainers.',
      addressLine1: '12 Fitness Rd',
      addressLine2: 'Near MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pinCode: '560001',
      latitude: 12.9716,
      longitude: 77.5946,
  },
  {
      email: 'info@gymtwo.com',
      password: 'GymTwoPassword123',
      name: 'Power House Gym',
      description: 'Where power meets performance.',
      addressLine1: '15 Workout St',
      addressLine2: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pinCode: '560038',
      latitude: 12.9716,
      longitude: 77.6412,
  },
  {
      email: 'info@gymthree.com',
      password: 'GymThreePassword123',
      name: 'Fitness First',
      description: 'Your fitness journey begins here.',
      addressLine1: '25 Health Ave',
      addressLine2: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pinCode: '560034',
      latitude: 12.9345,
      longitude: 77.6101,
  },
  {
      email: 'info@gymfour.com',
      password: 'GymFourPassword123',
      name: 'Muscle Factory',
      description: 'Building muscle, one workout at a time.',
      addressLine1: '8 Strength Rd',
      addressLine2: 'Jayanagar',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pinCode: '560011',
      latitude: 12.9352,
      longitude: 77.5900,
  },
  {
      email: 'info/gymfive.com',
      password: 'GymFivePassword123',
      name: 'Zenith Fitness',
      description: 'Achieve your peak performance.',
      addressLine1: '20 Sports St',
      addressLine2: 'HSR Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pinCode: '560102',
      latitude: 12.9279,
      longitude: 77.6450,
  },
  {
      email: 'info/gymsix.com',
      password: 'GymSixPassword123',
      name: 'Euphoria Gym',
      description: 'Your happiness, our priority.',
      addressLine1: '18 Wellness Blvd',
      addressLine2: 'Malleshwaram',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pinCode: '560055',
      latitude: 13.0015,
      longitude: 77.5734,
  },
  // Add more gyms up to 20...
  {
      email: 'info/gymtwenty.com',
      password: 'GymTwentyPassword123',
      name: 'Dynamic Gym',
      description: 'Dynamic workouts for dynamic individuals.',
      addressLine1: '50 Active Way',
      addressLine2: 'Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pinCode: '560066',
      latitude: 12.9747,
      longitude: 77.7514,
  }
];


const bulkInsertGyms = async (queryInterface) => {
    const hashedGyms = await Promise.all(gyms.map(async (gym) => {
        const hashedPassword = await bcrypt.hash(gym.password, 10);
        return {
            id: uuidv4(),
            email: gym.email,
            password: hashedPassword,
            name: gym.name,
            description: gym.description,
            addressLine1: gym.addressLine1,
            addressLine2: gym.addressLine2,
            city: gym.city,
            state: gym.state,
            country: gym.country,
            pinCode: gym.pinCode,
            latitude: gym.latitude,
            longitude: gym.longitude,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }));

    await queryInterface.bulkInsert('Gyms', hashedGyms, {});
};

module.exports = {
    up: async (queryInterface) => {
        await bulkInsertGyms(queryInterface);
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Gyms', null, {});
    },
};
