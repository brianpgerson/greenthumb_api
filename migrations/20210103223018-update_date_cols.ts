import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn(
        'waterings',
        'end_date',
        { type: DataTypes.STRING, allowNull: true },
        { transaction }
      );

      await queryInterface.changeColumn(
        'waterings',
        'start_date',
        { type: DataTypes.STRING },
        { transaction }
      );

      await queryInterface.addColumn(
        'waterings',
        'watering_date',
        { type: DataTypes.STRING, allowNull: true },
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
      await queryInterface.changeColumn(
        'waterings',
        'end_date',
        { type: DataTypes.DATE, allowNull: true },
        { transaction }
      );

      await queryInterface.changeColumn(
        'waterings',
        'start_date',
        { type: DataTypes.DATE },
        { transaction }
      );

      await queryInterface.removeColumn(
        'waterings',
        'watering_date',
        { transaction }
      );

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
