'use strict';

const User = require('./20180315010046-migrate');

const UserLocal = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('userLocals', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.BIGINT
      },
      district: {
        type: Sequelize.STRING,
        allowNull: false
      },
      local: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      province: {
        type: Sequelize.STRING,
        allowNull: false
      },
      suspend: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_locals');
  }
};

module.exports = UserLocal;