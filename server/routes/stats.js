import express from 'express';
import {
  getExerciseStats,
  getAllExercisesStats,
  recalculateExerciseStats
} from '../controllers/statsController.js';

const router = express.Router();

router.get('/', getAllExercisesStats);
router.get('/:exerciseId', getExerciseStats);
router.post('/:exerciseId/recalculate', recalculateExerciseStats);

export default router;
