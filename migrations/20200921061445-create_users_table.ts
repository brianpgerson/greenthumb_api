import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      password: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of creation',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of the last update',
      },
    });
  },
  down: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.dropTable('users');
  }
};