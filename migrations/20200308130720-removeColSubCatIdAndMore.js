
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('items', 'subcategory_id'),
    queryInterface.addColumn('items', 'categoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'categories',
        key: 'id',
      },
    }),
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
