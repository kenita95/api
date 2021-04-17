
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Sales_return_masters', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    invoice_number: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Invoice_masters',
        key: 'id',
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
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Sales_return_masters'),
};
