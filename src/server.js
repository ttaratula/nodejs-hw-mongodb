import express from 'express';
import cors from 'cors';
import logger from 'pino-http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';

dotenv.config();

export function setupServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(logger());

  
 const swaggerPath = path.join(process.cwd(), 'docs', 'openapi.yaml'); 
 const swaggerDocument = YAML.load(swaggerPath);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Test route
  app.get('/', (req, res) => {
    req.log.info('Request received at /');
    res.send('hello world');
  });

  // Routers
  app.use(router);

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
