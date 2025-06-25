import { Router } from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';
import {
  addTagToCourse,
  removeTagFromCourse,
} from '../controllers/courseTagController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { upload, processImage } from '../config/multer';

const router = Router();

router.post(
  '/courses',
  authenticateJWT,
  upload.single('image'),
  processImage,
  createCourse,
);

router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourseById);
router.put('/courses/:id', authenticateJWT, updateCourse);
router.patch('/courses/:id', authenticateJWT, updateCourse);
router.delete('/courses/:id', authenticateJWT, deleteCourse);
router.post('/courses/:id/tags/:tagId', authenticateJWT, addTagToCourse);
router.delete('/courses/:id/tags/:tagId', authenticateJWT, removeTagFromCourse);

export default router;
