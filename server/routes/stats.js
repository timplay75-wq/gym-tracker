import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getSummary,
  getWeeklyStats,
  getTopExercises,
  getExerciseHistory,
} from '../controllers/statsController.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/weekly', getWeeklyStats);
router.get('/exercises', getTopExercises);
router.get('/exercise/:name', getExerciseHistory);

export default router;
