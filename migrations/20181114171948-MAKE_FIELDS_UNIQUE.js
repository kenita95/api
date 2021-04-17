
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([queryInterface.changeColumn('subcategories', 'name', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  }), queryInterface.removeColumn('Stocks', 'status'), queryInterface.changeColumn('customers', 'type', {
    type: Sequelize.ENUM('customer', 'supplier'),
    allowNull: false,
    unique: 'compositeIndex',
  }), queryInterface.changeColumn('customers', 'title', {
    type: Sequelize.ENUM('Mr', 'Ms'),
    allowNull: false,
    unique: 'compositeIndex',
  }), queryInterface.changeColumn('customers', 'first_name', {
    allowNull: false,
    type: Sequelize.STRING,
    unique: 'compositeIndex',

  }), queryInterface.changeColumn('customers', 'last_name', {
    type: Sequelize.STRING,
    unique: 'compositeIndex',

  })]),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
