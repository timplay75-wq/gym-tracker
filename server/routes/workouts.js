import express from 'express';
import {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats
} from '../controllers/workoutController.js';

const router = express.Router();

router.get('/', getAllWorkouts);
router.get('/stats', getWorkoutStats);
router.get('/:id', getWorkoutById);
router.post('/', createWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;
