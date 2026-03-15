import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getPacks,
  purchasePack,
  getMyPurchases,
  getCoins,
} from '../controllers/shopController.js';

const router = express.Router();

router.use(protect);

router.get('/packs', getPacks);
router.post('/purchase/:packId', purchasePack);
router.get('/my-purchases', getMyPurchases);
router.get('/coins', getCoins);

export default router;
