// import cloudinary from 'cloudinary';
// import fs from 'node:fs/promises';

// import { getEnvVar } from './getEnvVar.js';
// import { CLOUDINARY } from '../constants/index.js';

// cloudinary.v2.config({
//   secure: true,
//   cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
//   api_key: getEnvVar(CLOUDINARY.API_KEY),
//   api_secret: getEnvVar(CLOUDINARY.API_SECRET),
// });

// export const saveFileToCloudinary = async (file) => {
//   const response = await cloudinary.v2.uploader.upload(file.path);
//   await fs.unlink(file.path);
//   return response.secure_url;
// };

import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

let isCloudinaryConfigured = false;

try {
  const cloudName = getEnvVar(CLOUDINARY.CLOUD_NAME);
  const apiKey = getEnvVar(CLOUDINARY.API_KEY);
  const apiSecret = getEnvVar(CLOUDINARY.API_SECRET);

  cloudinary.v2.config({
    secure: true,
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  isCloudinaryConfigured = true;
} catch (err) {
  console.warn('Cloudinary is not configured:', err.message);
}

export const saveFileToCloudinary = async (file) => {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured. Cannot upload files.');
  }
  const response = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
};
