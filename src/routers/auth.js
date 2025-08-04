import express from 'express';
import { registerController, loginUserController, refreshSessionController, logoutUserController } from '../controllers/auth.js';
import { registerSchema, loginUserSchema } from '../validations/authSchemas.js';
import { validateBody } from '../middlewares/validateBody.js';


const router = express.Router();

// Реєстрація нового користувача
router.post('/register', validateBody(registerSchema), registerController);

// Логін користувача
router.post('/login', validateBody(loginUserSchema), loginUserController);

//Оновлення
router.post('/refresh', refreshSessionController);

router.post('/logout', logoutUserController);
export default router;
