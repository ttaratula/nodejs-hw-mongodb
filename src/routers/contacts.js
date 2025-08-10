import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import {
  createContactSchema,
  updateContactSchema,
} from '../validations/contactSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';

// Імпортуємо multer middleware для завантаження фото
import upload from '../config/multer.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContactsController);
router.get('/:contactId', isValidId, getContactByIdController);

// Додаємо upload.single("photo") для завантаження файлу
router.post('/', upload.single("photo"), validateBody(createContactSchema), createContactController);

router.patch('/:contactId', isValidId, upload.single("photo"), validateBody(updateContactSchema), updateContactController);

router.delete('/:contactId', isValidId, deleteContactController);

export default router;
