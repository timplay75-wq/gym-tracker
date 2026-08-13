import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  changePassword,
  deleteMe,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';
import { strictLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

// Публичные. Логин и сброс пароля пригодны для перебора, поэтому поверх
// общего лимита на /api/users на них висит более строгий.
router.post('/register', validateRegister, registerUser);
router.post('/login', strictLimiter, validateLogin, loginUser);
router.post('/forgot-password', strictLimiter, forgotPassword);
router.post('/reset-password', strictLimiter, resetPassword);

// Защищённые
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/me/password', protect, changePassword);
router.delete('/me', protect, deleteMe);

export default router;
