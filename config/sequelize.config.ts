import config from './config';
import { SequelizeOptions } from 'sequelize-typescript'

const { db_name, db_username, db_dialect, db_password, db_host } = config;

const dbConfig: SequelizeOptions = {
  dialect: db_dialect,
  database: db_name,
  username: db_username,
  password: db_password,
  host: db_host,
  logging: false,
  port: 5432,
  define: {
    underscored: true,
    charset: 'utf8',
    timestamps: true, 
},
  timezone: 'UTC',
 }

export const development = dbConfig;
export const local = dbConfig;
export const testConfig = {
  ...dbConfig,
  database: 'greenthumb_test',
  username: 'greenthumb_test_user',
  password: 'greenthumb_test',
};
export const production = dbConfig;

const currentConfig = process.env.NODE_ENV === 'test' ? testConfig : dbConfig;
export default currentConfig;