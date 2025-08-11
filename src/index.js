// import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config();

import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const start = async () => {
  await initMongoConnection();  // підключення до бази
  setupServer();                // запуск сервера
};

start();


// src/constants/index.js

export const SMTP = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true' || false,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
};

export const TEMPLATES_DIR = process.env.TEMPLATES_DIR || './templates';

