import dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  port: number;
  env: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

const config: AppConfig = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

export default config;
