'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Invoice_details', 'serialNumber', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Stocks',
        key: 'id',
      },
      
    })
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
