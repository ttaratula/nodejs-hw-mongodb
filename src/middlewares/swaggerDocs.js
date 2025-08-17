import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
// import fs from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';
import YAML from 'yamljs';

// export const swaggerDocs = () => {
//   try {
//     const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
//     return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
//   } catch (err) {
//     console.error('Swagger load error:', err.message);
//     return (req, res, next) =>
//       next(createHttpError(500, "Can't load swagger docs"));
//   }
// };
// import createHttpError from 'http-errors';
// import swaggerUI from 'swagger-ui-express';
// import YAML from 'yamljs';

// import { SWAGGER_PATH } from '../constants/index.js';

// export const swaggerDocs = () => {
//   try {
//     const swaggerDoc = YAML.load(SWAGGER_PATH);
//     return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
//   } catch (err) {
//     console.error("Swagger load error:", err.message); 
//     return (req, res, next) =>
//       next(createHttpError(500, "Can't load swagger docs"));
//   }
// };


export const swaggerDocs = () => {
  try {
    const swaggerDocument = YAML.load(SWAGGER_PATH);
    return { serve: swaggerUI.serve, setup: swaggerUI.setup(swaggerDocument) };
  } catch (err) {
    console.error("Swagger load error:", err.message);
    return {
      serve: (req, res, next) => next(createHttpError(500, "Can't load swagger docs")),
      setup: (req, res, next) => next(createHttpError(500, "Can't load swagger docs")),
    };
  }
};

