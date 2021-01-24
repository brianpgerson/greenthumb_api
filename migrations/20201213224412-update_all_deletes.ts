import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'waterings',
        'waterings_plant_id_fkey',
        { transaction }
      );
      console.log('removed waterings')

      await queryInterface.removeConstraint(
        'schedules',
        'schedules_plant_id_fkey',
        { transaction }
      );
      console.log('removed schedules')

      await queryInterface.addConstraint(
        'waterings', 
        ['plant_id'], 
        {
          type: 'foreign key',
          name: 'waterings_plant_id_fkey',
          references: {
            table: 'plants',
            field: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          transaction
      })
      console.log('added waterings')
      await queryInterface.addConstraint('schedules', ['plant_id'], {
        type: 'foreign key',
        name: 'schedules_plant_id_fkey',
        references: {
          table: 'plants',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction
      });
      console.log('added schedules')

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface: QueryInterface, _: any) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'waterings',
        'waterings_plant_id_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('waterings', ['plant_id'], {
        type: 'foreign key',
        name: 'waterings_plant_id_fkey',
        references: {
          table: 'plants',
          field: 'id',
        },
        onDelete: 'NO_ACTION',
        onUpdate: 'NO_ACTION',
        transaction
      });
      await queryInterface.removeConstraint(
        'schedules',
        'schedules_plant_id_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('schedules', ['plant_id'], {
        type: 'foreign key',
        name: 'schedules_plant_id_fkey',
        references: {
          table: 'plants',
          field: 'id',
        },
        onDelete: 'NO_ACTION',
        onUpdate: 'NO_ACTION',
        transaction
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
