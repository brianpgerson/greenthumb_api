import {AutoIncrement, CreatedAt, UpdatedAt, ForeignKey, Table, PrimaryKey, Column, Model } from 'sequelize-typescript';
import { Plant } from './Plant'

export const RULE_CATEGORIES = {
  DAYS: 'DAYS',
  WEEKS: 'WEEKS',
}

@Table
export class Schedule extends Model<Schedule> {
 
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;
  
  @Column
  @ForeignKey(() => Plant)
  plantId!: number;

  @Column
  ruleNumber!: number;

  @Column
  rangeEnd: number;

  @Column
  ruleCategory!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}