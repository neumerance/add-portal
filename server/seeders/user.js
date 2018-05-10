'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        email: 'admin@addpro-portal.com',
        password: 'password',
        role: 1,
        firstname: 'JonJon',
        lastname: 'Canaveral',
        userLocalId: 1,
        createdAt: new Date().toISOString().slice(0,10),
        updatedAt: new Date().toISOString().slice(0,10)
      },
      {
        email: 'addpro@addpro-portal.com',
        password: 'password',
        role: 2,
        firstname: 'Edgar',
        lastname: 'Abujen',
        userLocalId: 2,
        createdAt: new Date().toISOString().slice(0,10),
        updatedAt: new Date().toISOString().slice(0,10)
      },
      {
        email: 'viewer@addpro-portal.com',
        password: 'password',
        role: 3,
        firstname: 'Boy',
        lastname: 'Bente',
        userLocalId: 3,
        createdAt: new Date().toISOString().slice(0,10),
        updatedAt: new Date().toISOString().slice(0,10)
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};