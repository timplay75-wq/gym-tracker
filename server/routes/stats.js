import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getSummary,
  getWeeklyStats,
  getTopExercises,
  getExerciseHistory,
  getMuscleDistribution,
  getWeekdayFrequency,
} from '../controllers/statsController.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/weekly', getWeeklyStats);
router.get('/exercises', getTopExercises);
router.get('/muscles', getMuscleDistribution);
router.get('/exercise/:name', getExerciseHistory);
router.get('/weekdays', getWeekdayFrequency);

export default router;
