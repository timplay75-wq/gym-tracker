import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  changePassword,
  deleteMe,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';

const router = express.Router();

// Публичные
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Защищённые
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/me/password', protect, changePassword);
router.delete('/me', protect, deleteMe);

export default router;
