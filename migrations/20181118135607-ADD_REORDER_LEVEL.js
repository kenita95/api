module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('items', 'reorder_level', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
