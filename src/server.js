// import express from 'express';
// import cors from 'cors';
// import logger from 'pino-http';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import path from 'path';
// import swaggerUi from 'swagger-ui-express';
// import YAML from 'yamljs';

// import router from './routers/index.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import { notFoundHandler } from './middlewares/notFoundHandler.js';
// import { UPLOAD_DIR } from './constants/index.js';
// import { swaggerDocs } from './config/swaggerDocs.js';

// dotenv.config();

// export function setupServer() {
//   const app = express();

//   // Middleware
//   app.use(cors());
//   app.use(cookieParser());
//   app.use(express.json());
//   app.use('/uploads', express.static(UPLOAD_DIR));
//   app.use(logger());

//   app.use('/api-docs', ...swaggerDocs());

//   // Test route
//   app.get('/', (req, res) => {
//     req.log.info('Request received at /');
//     res.send('hello world');
//   });

//   // Routers
//   app.use(router);

//   // Error handlers
//   app.use(notFoundHandler);
//   app.use(errorHandler);

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// }
import express from 'express';
import cors from 'cors';
import logger from 'pino-http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config();

export function setupServer() {
  const app = express();
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use('/uploads', express.static(UPLOAD_DIR));
  // app.use('/api-docs', swaggerDocs());

  const swagger = swaggerDocs();
  app.use('/api-docs', swagger.serve, swagger.setup);


  app.use(logger());

  const PORT = process.env.PORT;

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