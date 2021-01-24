import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'users', 
        'apn_token',
        DataTypes.STRING(128),
        { transaction }
      ); 

      await queryInterface.addColumn(
        'users', 
        'timezone',
        DataTypes.STRING(64),
        { transaction }
      ); 

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;      
    }
  },
  down: async (queryInterface: QueryInterface, _: any) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('users', 'apn_token', { transaction });
      await queryInterface.removeColumn('schedules', 'timezone', { transaction });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;      
    }
  }
};
