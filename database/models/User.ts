import {AutoIncrement, HasMany, CreatedAt, UpdatedAt, Table, PrimaryKey, Column, Model } from 'sequelize-typescript';
import { Plant } from './Plant'

@Table
export class User extends Model<User> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  email: string;
  
  @Column
  password: string;

  @Column
  timezone: string;

  @HasMany(() => Plant)
  plants: Plant[];

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}