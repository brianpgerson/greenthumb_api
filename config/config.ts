import * as dotenv from 'dotenv';
dotenv.config();

interface ConfigI {
  db_username: string;
  db_password: string;
  db_name: string;
  db_host: string;
  db_dialect: 'postgres';
  jwt_secret: string;
  jwt_refresh_secret: string;
}

const config: ConfigI = {
  db_username: process.env.AWS_DB_USERNAME || '',
  db_password: process.env.AWS_DB_PASSWORD || '',
  db_name: process.env.AWS_DB_NAME || '',
  db_host: process.env.AWS_DB_HOST || '',
  db_dialect: 'postgres',
  jwt_secret: process.env.JWT_SECRET || '',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
}

export default config