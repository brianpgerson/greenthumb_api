import { Watering, STATUS } from '../database';
import { Transaction } from 'sequelize/types';
import { toCalendarDay } from '../util/general-utils';

export interface WateringRequest {
  startDate: string,
  endDate?: string,
  wateringDate?: string,
  status?: string,
  plantId: number,
}

const getFields = (wateringRequest: WateringRequest) => {
  const { 
    startDate: startDateRequest, 
    endDate: endDateRequest,
    wateringDate: wateringDateRequest, 
    status: statusRequest, 
    plantId 
  } = wateringRequest;
  const startDate = startDateRequest;
  const endDate  = endDateRequest || null;
  const wateringDate = wateringDateRequest || null
  const status = statusRequest || STATUS.PENDING;
  return { startDate, endDate, wateringDate, status, plantId };
}

export const createWatering = async (wateringRequest: WateringRequest, txn?: Transaction) => {
  const fields = getFields(wateringRequest);
  
  console.log("ARF! I am creating a watering:", JSON.stringify(fields, null, 2));

  try {
    return await Watering.create(fields, { transaction: txn });
  } catch (e) {
    console.error('Could not create next watering! Error: ', e);
    return null;
  }
}

export const updateWatering = async (watering: Watering, wateringRequest: WateringRequest, txn?: Transaction) => {
  const fields = getFields(wateringRequest);
  console.log("WOOF! I am updating a watering:", JSON.stringify(fields, null, 2));
  try {
    return await watering.update(fields, { transaction: txn });
  } catch (e) {
    console.error('Could not update next watering! Error: ', e);
    return null;
  }
}
