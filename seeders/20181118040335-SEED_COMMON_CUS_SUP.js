'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('customers', [{
        type: 'customer',
        title: 'Mr',
        customer_type: 'especial',
        first_name: 'Valued',
        last_name: 'Customer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 'supplier',
        title: 'Mr',
        customer_type: 'especial',
        first_name: 'Valued',
        last_name: 'Supplier',
        createdAt: new Date(),
        updatedAt: new Date()

      }
    ], {});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulk:':'Delete('Person', null, {});
    */
  }
};