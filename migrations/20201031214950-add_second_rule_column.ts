import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn(
      'schedules', 
      'range_end',
      DataTypes.INTEGER,
    );
  },
  down: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.removeColumn('schedules', 'range_end');
  }
};
