'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('Stocks', 'grnId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Grn_masters',
          key: 'id',
        },
        
      }),
      queryInterface.addColumn('Stocks', 'invoiceId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Invoice_masters',
          key: 'id',
        },
        
      }),
      queryInterface.addColumn('Stocks', 'srId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Sales_return_masters',
          key: 'id',
        },
        
      }),
      queryInterface.addColumn('Stocks', 'PrId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Purchase_return_masters',
          key: 'id',
        },
        
      }),
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
