
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('customers', 'address', { type: Sequelize.STRING(300) }),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
