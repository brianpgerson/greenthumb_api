import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('schedules', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      plant_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'plants',
          key: 'id',
        }
      },
      rule_number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rule_category: {
        type: new DataTypes.STRING(128),
        allowNull: false,
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
    return queryInterface.dropTable('schedules');
  }
};
