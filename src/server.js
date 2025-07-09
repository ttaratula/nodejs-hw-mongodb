import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { getAllContactsController, getContactByIdController } from './controllers/contacts.js';

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json()); // важливо для парсингу JSON

  // Крок 5 — всі контакти
  app.get('/contacts', getAllContactsController);

  // Крок 6 — контакт по ID
  app.get('/contacts/:contactId', getContactByIdController);


  app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}


