"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("Gyms", "total_rating", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn("Gyms", "rating"),
      queryInterface.removeColumn("Gyms", "total_rating"),
    ]);
  },
};
