import express from 'express';
import { 
  registerController, 
  loginUserController, 
  refreshSessionController, 
  logoutUserController 
} from '../controllers/auth.js';
import { sendResetEmail } from '../controllers/sendResetEmail.js';
import { registerSchema, loginUserSchema, emailSchema, resetPwdSchema } from '../validations/authSchemas.js';
import { validateBody } from '../middlewares/validateBody.js';
import { resetPasswordController } from '../controllers/resetPassword.js';
import upload from '../config/multer.js'; 

import {createContactController, patchContactController} from "../controllers/contacts.js";

  
const router = express.Router();

// Реєстрація нового користувача
router.post(
  '/register', 
  upload.single('photo'), // "photo" — це назва поля з Postman
  validateBody(registerSchema), 
  registerController
);

router.post(
  '/',
  upload.single('photo'), // додано multer для одного файлу photo
  createContactController
);

router.patch(
  '/:contactId',
  upload.single('photo'), // multer для оновлення фото
  patchContactController
);


// Логін користувача
router.post('/login', validateBody(loginUserSchema), loginUserController);

// Оновлення
router.post('/refresh', refreshSessionController);

// Логаут
router.post('/logout', logoutUserController);

// Надсилання email для скиду паролю
router.post('/send-reset-email', validateBody(emailSchema), sendResetEmail);

router.post('/reset-pwd', validateBody(resetPwdSchema), resetPasswordController);


export default router;
