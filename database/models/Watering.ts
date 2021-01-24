import {AutoIncrement, HasMany, CreatedAt, UpdatedAt, ForeignKey, Table, PrimaryKey, Column, Model } from 'sequelize-typescript';
import { Plant } from './Plant'

export const STATUS = {
  PENDING: 'PENDING',
  OVERDUE: 'OVERDUE',
  MISSED: 'MISSED',
  COMPLETE: 'COMPLETE',
}

@Table
export class Watering extends Model<Watering> {
 
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  @ForeignKey(() => Plant)
  plantId!: number;

  @Column
  status!: string;

  @Column
  startDate!: string;

  @Column
  endDate: string;

  @Column
  wateringDate: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}