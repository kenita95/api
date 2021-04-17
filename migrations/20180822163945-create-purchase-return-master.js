
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Purchase_return_masters', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    grn_number: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Grn_masters',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Purchase_return_masters'),
};
