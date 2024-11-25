'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new column
    await queryInterface.addColumn('Gyms', 'gym_unique_id', {
      type: Sequelize.STRING(6),
      allowNull: true,
      unique: true,
    });

    // Populate `gym_unique_id` for existing rows
    const [gyms] = await queryInterface.sequelize.query('SELECT id FROM "Gyms"');
    const updates = gyms.map(async (gym) => {
      let uniqueId;
      do {
        uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
        const [existing] = await queryInterface.sequelize.query(
          'SELECT 1 FROM "Gyms" WHERE gym_unique_id = ? LIMIT 1',
          { replacements: [uniqueId] }
        );
        if (!existing.length) break;
      } while (true);

      return queryInterface.sequelize.query(
        'UPDATE "Gyms" SET gym_unique_id = ? WHERE id = ?',
        { replacements: [uniqueId, gym.id] }
      );
    });

    await Promise.all(updates);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Gyms', 'gym_unique_id');
  },
};
