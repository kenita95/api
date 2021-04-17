'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('items', 'description', {
        type: Sequelize.STRING,
        
      }),
      // queryInterface.addColumn('items', 'bulkQR', {
      //   type: Sequelize.BOOLEAN,
      //   defaultValue: false,
      // })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
