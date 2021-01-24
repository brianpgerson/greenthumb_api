import { Plant, Watering, Schedule } from '../database';
import { Transaction } from 'sequelize/types';

export interface PlantRequest {
  name: string,
  type: string,
  userId: number,
}

export const createPlant = async (plantRequest: PlantRequest, txn?: Transaction ) => {
  try {
    return Plant.create(plantRequest, { transaction: txn });
  } catch (e) {
    console.error('Could not create plant! Error: ', e);
    return null;
  }
}

export const updatePlant = async (plant: Plant, plantRequest: PlantRequest, txn?: Transaction ) => {
  try {
    return plant.update(plantRequest, { transaction: txn });
  } catch (e) {
    console.error('Could not create plant! Error: ', e);
    return null;
  }
}

export const getPlants = (userId: number) =>  Plant.findAll({ 
  where: { userId }, 
  include: [{ model: Watering }, { model: Schedule }]
});

export const getPlant = (plantId: number) => 
  Plant.findByPk(plantId, { include: [{ model: Watering }, { model: Schedule }] });

export const deletePlant = (plantId: number) =>  Plant.destroy({ where: { id: plantId } });