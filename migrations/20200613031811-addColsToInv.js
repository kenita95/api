
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Invoice_masters', 'billNo', { type: Sequelize.STRING }),
    queryInterface.addColumn('Invoice_masters', 'referenceNo', { type: Sequelize.STRING }),
    queryInterface.addColumn('Invoice_masters', 'deliveryCost', { type: Sequelize.FLOAT }),
  ]),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
