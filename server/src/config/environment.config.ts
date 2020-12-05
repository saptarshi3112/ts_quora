import dotenv from 'dotenv';
dotenv.config();

export const environment: any = {
  "dbPort": Number.parseInt(process.env.DB_PORT, 10),
  "dbHost": process.env.DB_HOST,
  "dbName": process.env.DB_NAME,
  "port": Number.parseInt(process.env.PORT, 10)
};
