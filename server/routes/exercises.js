import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  seedExercises,
} from '../controllers/exerciseController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllExercises);
router.post('/seed', seedExercises);
router.get('/:id', getExerciseById);
router.post('/', createExercise);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);

export default router;
