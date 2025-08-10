import express from 'express';
import { 
  registerController, 
  loginUserController, 
  refreshSessionController, 
  logoutUserController 
} from '../controllers/auth.js';
import { sendResetEmail } from '../controllers/sendResetEmail.js';
import { registerSchema, loginUserSchema } from '../validations/authSchemas.js';
import { validateBody } from '../middlewares/validateBody.js';
import { resetPasswordController } from '../controllers/resetPassword.js';

// Якщо є схема для валідації email:
import Joi from "joi";
const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPwdSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });

  
const router = express.Router();

// Реєстрація нового користувача
router.post('/register', validateBody(registerSchema), registerController);

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
