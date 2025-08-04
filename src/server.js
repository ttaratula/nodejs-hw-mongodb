import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import contactsRouter from './routers/contacts.js'; 
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Підключаємо всі маршрути 
  app.use('/auth', authRouter); 
  app.use('/contacts', contactsRouter);

  app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
  });

  app.use(notFoundHandler);  
  app.use(errorHandler); 

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  app.use(cookieParser());
}
