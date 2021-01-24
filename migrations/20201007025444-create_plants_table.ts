import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('plants', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: new DataTypes.STRING(128),
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        }
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
    return queryInterface.dropTable('plants');
  }
};
