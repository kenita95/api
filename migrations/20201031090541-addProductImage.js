'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('items', 'images', {
        type: Sequelize.STRING,
        defaultValue: '',
      }),
      queryInterface.addColumn('items', 'make', {
        type: Sequelize.STRING,
        defaultValue: '',
      }),
      queryInterface.addColumn('items', 'model', {
        type: Sequelize.STRING,
        defaultValue: '',
      }),
      queryInterface.addColumn('items', 'serialNumber', {
        type: Sequelize.STRING,
        defaultValue: '',
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
