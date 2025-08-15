// import express from 'express';
// import cors from 'cors';
// import logger from 'pino-http';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import router from './routers/index.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import { notFoundHandler } from './middlewares/notFoundHandler.js';
// import { UPLOAD_DIR } from './constants/index.js';

// dotenv.config();

// export function setupServer() {
//   const app = express();
//   app.use(cors());
//   app.use(cookieParser());
//   app.use(express.json());
//   app.use('/uploads', express.static(UPLOAD_DIR));

//   app.use(logger());

//   const PORT = process.env.PORT;

//   app.get('/', (req, res) => {
//     req.log.info('Request received at /');
//     res.send('hello world');
//   });

//   app.use(router);

//   app.use(notFoundHandler);
//   app.use(errorHandler);

//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// }


import express from 'express';
import cors from 'cors';
import logger from 'pino-http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(logger());

  const PORT = process.env.PORT;

  // Swagger setup
  const swaggerDocument = YAML.load(path.join(__dirname, './docs/openapi.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/', (req, res) => {
    req.log.info('Request received at /');
    res.send('hello world');
  });

  app.use(router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
