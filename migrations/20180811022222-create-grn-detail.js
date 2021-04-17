'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Grn_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      unit_price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      qty: {
        type: Sequelize.FLOAT,
        allowNull: false

      },
      total: {
        type: Sequelize.FLOAT,
        allowNull: false

      },
      grn_master_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Grn_masters',
          key: 'id'
        }
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'items',
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
    return queryInterface.dropTable('Grn_details');
  }
};