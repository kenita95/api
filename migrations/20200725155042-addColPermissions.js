
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'permissions', {
    type: Sequelize.TEXT,
  }),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
