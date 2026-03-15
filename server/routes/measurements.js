import express from 'express';
import { getAll, getLatest, upsert, remove } from '../controllers/measurementController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getAll);
router.get('/latest', getLatest);
router.post('/', upsert);
router.delete('/:date', remove);

export default router;
