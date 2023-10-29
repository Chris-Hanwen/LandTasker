import * as dotenv from 'dotenv';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config();

const config = {
  port: process.env.PORT || 8000,
  api: { prefix: process.env.API_PREFIX || '/api/v1' },
  db: process.env.db || 'mongodb://localhost:27017/',
  secret: process.env.TOKEN_SECRET || 'test',
};
export default config;
