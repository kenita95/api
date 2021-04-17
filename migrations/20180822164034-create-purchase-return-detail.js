'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Purchase_return_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      qty: {
        type: Sequelize.FLOAT,
      },
      return_qty: {
        type: Sequelize.FLOAT,
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "items",
          key: "id",
        },
      },
      pr_number: {
        type: Sequelize.INTEGER,
        references: {
          model: "Purchase_return_masters",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Purchase_return_details');
  }
};