'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('EquipmentList', [
      {
        equipment_name: 'Treadmill',
        equipment_details: 'High-quality treadmill for cardio workouts, equipped with a digital monitor to track speed, distance, and calories.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 4.5C19 3.12 17.88 2 16.5 2S14 3.12 14 4.5 15.12 7 16.5 7 19 5.88 19 4.5zM5 21.5c-.55 0-1-.45-1-1 0-.27.11-.52.29-.71l4.88-4.88L8 13H5c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h7c.55 0 1 .45 1 1s-.45 1-1 1H5v3h3c.4 0 .76.24.92.62.16.38.08.81-.19 1.12l-1.62 1.8 2.5 2.5 6.03-6.03c.3-.3.68-.44 1.06-.44H21c.55 0 1 .45 1 1s-.45 1-1 1h-4.14l-6.15 6.15c-.12.12-.26.22-.41.29l-3.36 1.45c-.1.05-.2.07-.3.07z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Dumbbells',
        equipment_details: 'Set of dumbbells ranging from 5 to 50 lbs, perfect for strength training and muscle building.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 7c-.55 0-1-.45-1-1s.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4zm0 10c-.55 0-1-.45-1-1s.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4zm0-6c-.55 0-1-.45-1-1s.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Bench Press',
        equipment_details: 'Adjustable bench press station with barbell and weight plates, ideal for chest exercises.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 12h-4v2h4v-2zm-4-4h4v2h-4V8zm-2 8h4v2h-4v-2zm-4 2c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1s1 .45 1 1v10c0 .55-.45 1-1 1zm-6-2h4v2H6v-2zm0-4h4v2H6v-2zm0-4h4v2H6V8z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Stationary Bike',
        equipment_details: 'Stationary exercise bike with adjustable resistance, perfect for indoor cardio workouts.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-14-6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4.97-14c-.2 0-.39.07-.53.21L6.27 7H4.5C3.67 7 3 7.67 3 8.5S3.67 10 4.5 10H7c.31 0 .6-.15.78-.4L9 7.5l2.37 3.32c.22.31.56.5.93.5h5.37l-.96 1.15c-.19.23-.3.52-.3.83 0 .69.56 1.25 1.25 1.25.38 0 .74-.18.98-.47l3.14-3.92c.17-.2.26-.45.26-.71V8.5C22 7.67 21.33 7 20.5 7h-9.11l-1.6-2.24A.75.75 0 0 0 9.97 4zm1.19 8H10l-.75-1.05L11 8.25 13.19 12h-2.03z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Elliptical Trainer',
        equipment_details: 'Smooth and quiet elliptical trainer with adjustable stride length and resistance for a full-body workout.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 5c-3.07 0-5.64 2.1-6.32 5h12.65c-.68-2.9-3.25-5-6.33-5zm6.32 7H5.68c.68 2.9 3.25 5 6.32 5s5.64-2.1 6.32-5zm-6.32-7C8.13 5 5.31 7.14 4.3 10.01A7.996 7.996 0 0 0 12 18c3.87 0 7.14-2.75 7.7-6.42-.93-3.05-3.72-5.27-7.04-5.55L12 5zm0 2.5c1.74 0 3.2 1.15 3.74 2.75H8.26C8.8 8.65 10.26 7.5 12 7.5z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Rowing Machine',
        equipment_details: 'Advanced rowing machine with adjustable resistance, designed for cardiovascular and strength training.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 6c-1.66 0-3 1.34-3 3 0 1.31.84 2.42 2.02 2.83L2 17v2l2 1h16l2-1v-2l-9-5.17A2.985 2.985 0 0 0 15 9c0-1.66-1.34-3-3-3zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Smith Machine',
        equipment_details: 'Multi-purpose Smith machine with adjustable barbell and safety locks, ideal for squats, bench press, and shoulder press.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.5 14.5H11v2H8v2H6v-5.5l1.5-1.5H9c.55 0 1 .45 1 1v.5h-.5zm7 0h-1.5v2H16v2h2v-5.5l-1.5-1.5H15c-.55 0-1 .45-1 1v.5h.5zM20 2H4c-1.1 0-2 .9-2 2v16h2v2h3v-2h10v2h3v-2h2V4c0-1.1-.9-2-2-2zm0 16H4V4h16v14z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Lat Pulldown Machine',
        equipment_details: 'Versatile lat pulldown machine with adjustable weights, designed for back and shoulder workouts.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 10h-2.1c.07.33.1.66.1 1 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-.34.03-.67.1-1H6c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2zm-3-2.82c-.25.08-.49.2-.7.35l-2.3 1.72c-.3.22-.7.22-1 0L8.39 7.53c-.7-.52-1.67-.62-2.48-.25-.95.43-1.52 1.36-1.6 2.35-.03.34-.32.59-.66.59-.41 0-.73-.36-.69-.76.13-1.3.83-2.5 1.93-3.13 1.41-.8 3.15-.57 4.36.34l.95.71 1.14-.85c1.25-.94 2.89-1.16 4.3-.57 1.22.5 2.1 1.65 2.27 2.95.05.4-.28.76-.69.76-.34 0-.63-.25-.67-.59-.1-.94-.67-1.75-1.52-2.09z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Pull-Up Bar',
        equipment_details: 'Sturdy pull-up bar with multiple grip positions for upper body workouts.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 21v-2h16v2H4zm0-5.5c-.55 0-1-.45-1-1s.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1H4zm4.5-11h7c.83 0 1.5.67 1.5 1.5V12c0 .55-.45 1-1 1s-1-.45-1-1V6h-7v6c0 .55-.45 1-1 1s-1-.45-1-1V5.5c0-.83.67-1.5 1.5-1.5z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Leg Press Machine',
        equipment_details: 'Heavy-duty leg press machine with adjustable seat and footplate, designed for lower body strength training.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.5 4C19.33 4 20 4.67 20 5.5S19.33 7 18.5 7H17v10h1.5c.83 0 1.5.67 1.5 1.5S19.33 20 18.5 20h-13C4.67 20 4 19.33 4 18.5S4.67 17 5.5 17H7V7H5.5C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4h13zM13 7h-2v10h2V7z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Cable Machine',
        equipment_details: 'Multi-functional cable machine with adjustable pulleys for a wide range of strength exercises.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 2v3h-3.5c-.83 0-1.5.67-1.5 1.5v2.88l-3.74 4.29c-.05-.01-.09-.02-.14-.02H7c-1.1 0-2 .9-2 2v5.5H3V22h7v-1.85H8V15h2.99l3.74-4.29c.05.01.09.02.14.02h2.13c.2.58.76 1 1.4 1h2.6v3h-2v1h2c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2V2h-2zM6 18h1v2H6v-2z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Preacher Curl Bench',
        equipment_details: 'Preacher curl bench with padded seat and arm support, ideal for targeting biceps.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.5 4c-.28 0-.5.22-.5.5V6h-2V4.5C10 3.12 11.12 2 12.5 2h5c1.38 0 2.5 1.12 2.5 2.5V6h-2V4.5c0-.28-.22-.5-.5-.5h-5zM6 6c-.55 0-1 .45-1 1s.45 1 1 1h2v7.53l-.95 4.26c-.12.54-.18 1.1-.18 1.65H9c0-.57.06-1.14.18-1.69L10 15h4l.82 3.75c.12.55.18 1.12.18 1.69h3c0-.57-.06-1.11-.18-1.65L16 14.53V8h2c.55 0 1-.45 1-1s-.45-1-1-1H6z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Battle Ropes',
        equipment_details: 'Heavy-duty battle ropes for high-intensity cardio and strength training.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 15v4c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h2V8H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2v5h2c1.1 0 2 .9 2 2zm-6 0V8H6v7h8z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        equipment_name: 'Resistance Bands',
        equipment_details: 'Set of resistance bands for strength training and mobility exercises, available in various resistance levels.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.25 2.75h-2.5c-.69 0-1.25.56-1.25 1.25v2.5c0 .69.56 1.25 1.25 1.25h2.5c.69 0 1.25-.56 1.25-1.25v-2.5c0-.69-.56-1.25-1.25-1.25zm-12 0h-2.5C4.06 2.75 3.5 3.31 3.5 4v2.5c0 .69.56 1.25 1.25 1.25h2.5c.69 0 1.25-.56 1.25-1.25V4c0-.69-.56-1.25-1.25-1.25zm12 12h-2.5c-.69 0-1.25.56-1.25 1.25v2.5c0 .69.56 1.25 1.25 1.25h2.5c.69 0 1.25-.56 1.25-1.25v-2.5c0-.69-.56-1.25-1.25-1.25zm-12 0h-2.5C4.06 14.75 3.5 15.31 3.5 16v2.5c0 .69.56 1.25 1.25 1.25h2.5c.69 0 1.25-.56 1.25-1.25V16c0-.69-.56-1.25-1.25-1.25z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ,
      {
        equipment_name: 'Yoga Mat',
        equipment_details: 'Premium yoga mat with non-slip surface, ideal for yoga, Pilates, and stretching exercises.',
        equipment_icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.21 11.29l-9-9A.996.996 0 0011.5 2H8c-.28 0-.53.11-.71.29l-5 5A.996.996 0 002 8v6c0 .28.11.53.29.71l9 9c.19.19.45.29.71.29h3.5c.28 0 .53-.11.71-.29l5-5c.19-.19.29-.45.29-.71V12c0-.28-.11-.53-.29-.71zM8.91 4H10v4.09L6.09 4H7.5c.39 0 .77.15 1.05.44.28.28.43.66.43 1.05V8.5L4 10.91V9.5c0-.39.15-.77.44-1.05L8.91 4zm2.92 16H14v-4.09L17.91 20H16.5c-.39 0-.77-.15-1.05-.44-.28-.28-.43-.66-.43-1.05V15.5L20 13.09V14.5c0 .39-.15.77-.44 1.05l-8.73 8.73z"/></svg>`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ]);

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('EquipmentList', null, {});
  }
};
