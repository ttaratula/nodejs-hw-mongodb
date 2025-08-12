import dotenv from 'dotenv';

dotenv.config();

export function getEnvVar(key) {
  if (!key) {
    throw new Error('Environment variable key is required');
  }

  const value = process.env[key];

  if (typeof value === 'undefined') {
    throw new Error(`Environment variable "${key}" is not defined`);
  }

  return value;
}