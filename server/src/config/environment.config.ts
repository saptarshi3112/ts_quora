import dotenv from 'dotenv';
dotenv.config();

export const environment = {
  "dbPort": Number.parseInt(process.env.DB_PORT, 10),
  "dbHost": process.env.DB_HOST,
  "dbName": process.env.DB_NAME,
  "port": Number.parseInt(process.env.PORT, 10),
  "jwtSecret": process.env.JWT_SECRET,
  "mailerEmail": process.env.AUTH_EMAIL,
  "mailerPassword": process.env.AUTH_EMAIL_PASSWORD,
  "mailerService": process.env.AUTH_EMAIL_SERVICE
};
