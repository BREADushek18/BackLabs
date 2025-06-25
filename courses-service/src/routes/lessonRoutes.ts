import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  createLesson,
  getLesson,
  getAllLessons,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController';

const router = express.Router();

router.post('/', authenticateJWT, createLesson);
router.get('/', getAllLessons);
router.get('/:id', getLesson);
router.patch('/:id', authenticateJWT, updateLesson);
router.delete('/:id', authenticateJWT, deleteLesson);

export default router;
