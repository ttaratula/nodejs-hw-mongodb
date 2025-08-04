import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController, 
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import {validateBody} from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import {
  createContactSchema,
  updateContactSchema,
} from '../validations/contactSchemas.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContactsController);
router.get('/:contactId', isValidId, getContactByIdController);
router.post('/', validateBody(createContactSchema), createContactController); 
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), updateContactController);
// router.post('/register', validateBody(registerSchema), registerController);
router.delete('/:contactId', isValidId, deleteContactController);

export default router;
