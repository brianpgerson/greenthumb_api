import { Schedule } from '../database';
import { Transaction } from 'sequelize/types';

export interface ScheduleRequest {
  ruleNumber: number,
  rangeEnd: number,
  ruleCategory: string,
  plantId: number,
}

export const createSchedule = async (scheduleRequest: ScheduleRequest, txn?: Transaction) => {
  try {
    return await Schedule.create(scheduleRequest, { transaction: txn });
  } catch (e) {
    console.error('Could not create rule! Error: ', e);
    return null;
  }
}

export const updateSchedule = async (schedule: Schedule, scheduleRequest: ScheduleRequest, txn?: Transaction ) => {
  try {
    return schedule.update(scheduleRequest, { transaction: txn });
  } catch (e) {
    console.error('Could not update schedule! Error: ', e);
    return null;
  }
}
