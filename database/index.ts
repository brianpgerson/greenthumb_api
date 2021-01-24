import { Sequelize } from 'sequelize-typescript';
import dbConfig from '../config/sequelize.config';

export const sequelize = new Sequelize({ 
  ...dbConfig,
  models: [__dirname + '/models']
});

const testConnection = async (sequelize: Sequelize) => {
  console.log('uhhh hello');
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection(sequelize);

export * from './models/User'
export * from './models/Plant'
export * from './models/Schedule'
export * from './models/Watering'


