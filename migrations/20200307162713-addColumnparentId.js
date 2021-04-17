
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('categories', 'parentId', {
    type: Sequelize.INTEGER,

    references: {
      model: 'categories',
      key: 'id',
    },

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
