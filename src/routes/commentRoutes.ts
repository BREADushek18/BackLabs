import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  createComment,
  getCommentsByLesson,
  getCommentById,
  updateComment,
  deleteComment,
} from '../controllers/commentController';

const router = express.Router();

router.post('/', authenticateJWT, createComment);
router.get('/lesson/:lessonId', getCommentsByLesson);
router.get('/:id', getCommentById);
router.patch('/:id', authenticateJWT, updateComment);
router.delete('/:id', authenticateJWT, deleteComment);

export default router;
