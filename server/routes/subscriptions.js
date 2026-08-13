import express from 'express';
import { protect } from '../middleware/auth.js';
import { verifyWebhookSignature } from '../middleware/webhookSignature.js';
import {
  getPlans,
  getStatus,
  createSubscription,
  cancelSubscription,
  getHistory,
  handleWebhook,
} from '../controllers/subscriptionController.js';

const router = express.Router();

// Публичный роут — webhook от платёжного провайдера.
// Авторизация не по JWT, а по HMAC-подписи тела запроса.
router.post('/webhook', verifyWebhookSignature, handleWebhook);

// Все остальные роуты требуют авторизации
router.use(protect);

router.get('/plans', getPlans);
router.get('/status', getStatus);
router.post('/create', createSubscription);
router.post('/cancel', cancelSubscription);
router.get('/history', getHistory);

export default router;
