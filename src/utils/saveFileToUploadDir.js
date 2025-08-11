// import path from 'node:path';
// import fs from 'node:fs/promises';
// import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
// import { getEnvVar } from './getEnvVar.js';

// export const saveFileToUploadDir = async (file) => {
//   // Переміщаємо файл з тимчасової папки у постійну папку uploads
//   await fs.rename(
//     path.join(TEMP_UPLOAD_DIR, file.filename),
//     path.join(UPLOAD_DIR, file.filename),
//   );

//   // Формуємо URL доступу до файлу
//   return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
// };
import path from 'node:path';
import fs from 'node:fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const TEMP_UPLOAD_DIR = path.resolve(process.env.TEMP_UPLOAD_DIR || 'tmp');
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || 'public/uploads');
const APP_DOMAIN = process.env.APP_DOMAIN || 'http://localhost:3000';

export const saveFileToUploadDir = async (file) => {
  // Переміщаємо файл з тимчасової папки у постійну папку uploads
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  // Формуємо URL доступу до файлу
  return `${APP_DOMAIN}/uploads/${file.filename}`;
};
