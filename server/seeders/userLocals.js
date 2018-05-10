'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('userLocals', [
      {
        district: 'BATZAM',
        local: 'COLO',
        city: 'Dinalupihan',
        province: 'Bataan',
        createdAt: new Date().toISOString().slice(0,10),
        updatedAt: new Date().toISOString().slice(0,10)
      },
      {
        district: 'BATZAM',
        local: 'Baretto St.',
        city: 'Olongapo',
        province: 'Zambales',
        createdAt: new Date().toISOString().slice(0,10),
        updatedAt: new Date().toISOString().slice(0,10)
      },
      {
        district: 'BATZAM',
        local: 'Bagac',
        city: 'Balanga',
        province: 'Bataan',
        createdAt: new Date().toISOString().slice(0,10),
        updatedAt: new Date().toISOString().slice(0,10)
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('userLocals', null, {});
  }
};