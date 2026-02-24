import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllRecords,
  getRecordByExercise,
  deleteRecord,
} from '../controllers/personalRecordController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllRecords);
router.get('/:exerciseName', getRecordByExercise);
router.delete('/:exerciseName', deleteRecord);

export default router;
