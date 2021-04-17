'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      measurement_unit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      selling_price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      subcategory_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subcategories",
          key: 'id'
        }
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
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
    return queryInterface.dropTable('items');
  }
};