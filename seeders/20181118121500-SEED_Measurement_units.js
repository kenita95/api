'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Measurement_units', [{
      name: 'Units',
      createdAt: new Date(),
      updatedAt: new Date()

    }, {
      name: 'KG',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Meters',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Yards',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};