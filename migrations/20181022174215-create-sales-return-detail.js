'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sales_return_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      return_qty: {
        type: Sequelize.INTEGER
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'items',
          key: 'id'
        }
      },
      sr_number: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Sales_return_masters',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Sales_return_details');
  }
};