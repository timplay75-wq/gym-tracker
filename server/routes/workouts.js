import express from 'express';
import {
  fixCompletedWorkouts,
  getAllWorkouts,
  getTodayWorkout,
  getCalendar,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  startWorkout,
  completeWorkout,
  getWorkoutStats,
} from '../controllers/workoutController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Все роуты защищены
router.use(protect);

router.get('/', getAllWorkouts);
router.post('/fix-completed', fixCompletedWorkouts);
router.get('/today', getTodayWorkout);
router.get('/calendar', getCalendar);
router.get('/stats', getWorkoutStats);
router.get('/:id', getWorkoutById);
router.post('/', createWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);
router.post('/:id/start', startWorkout);
router.post('/:id/complete', completeWorkout);

export default router;
