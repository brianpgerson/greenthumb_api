import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.changeColumn(
      'waterings', 
      'end_date',
      { type: DataTypes.DATE, allowNull: true }
    );
  },
  down: (queryInterface: QueryInterface, _: any) => {
    return queryInterface.changeColumn(
      'waterings', 
      'end_date',
      { type: DataTypes.DATE, allowNull: false }
    );
  }
};
