
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('Users', 'surname'),
    queryInterface.removeColumn('Users', 'employee_number'),

  ]),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
