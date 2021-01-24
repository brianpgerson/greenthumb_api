import {AutoIncrement, HasMany, CreatedAt, UpdatedAt, ForeignKey, Table, PrimaryKey, Column, Model, HasOne } from 'sequelize-typescript';
import { User } from './User'
import { Watering } from './Watering'
import { Schedule } from './Schedule'

@Table
export class Plant extends Model<Plant> {
 
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  type: string;
  
  @Column
  name: string;

  @Column
  @ForeignKey(() => User)
  userId!: number;

  @HasMany(() => Watering, { onDelete: 'CASCADE' })
  waterings: Watering[];

  @HasOne(() => Schedule, { onDelete: 'CASCADE' })
  schedule: Schedule;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}