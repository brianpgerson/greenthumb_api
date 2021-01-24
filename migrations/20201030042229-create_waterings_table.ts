import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('waterings', {
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
        },
      },
      status: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'beginning of watering date range',
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'end of watering date range',
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
    return queryInterface.dropTable('waterings');
  }
};
