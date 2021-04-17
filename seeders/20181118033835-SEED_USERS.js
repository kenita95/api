
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [{
    role: 'admin',
    title: true,
    first_name: 'System',
    last_name: 'Admin',
    email: 'admin@system.com',
    // employee_number: 10001,
    password: '123456',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  ], {
    // hooks: true,
    individualHooks: true,
  }, {}),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  },
};
