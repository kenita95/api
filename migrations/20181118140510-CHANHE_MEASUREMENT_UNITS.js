'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.changeColumn('items', 'measurement_unit', {
      type: Sequelize.INTEGER,
      // references: {
      //   model: "Measurement_units",
      //   key: 'id'
      // }
    });

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};