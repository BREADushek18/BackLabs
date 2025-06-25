import { Router } from 'express';
import {
  enrollInCourse,
  getMyEnrollments,
  deleteEnrollment,
  markLessonCompleted,
  getCourseProgress,
  countCourseStudents,
  unmarkLessonCompleted,
} from '../controllers/enrollmentController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.post('/enroll/:courseId', enrollInCourse);
router.get('/my-enrollments', getMyEnrollments);
router.delete('/enroll/:courseId', deleteEnrollment);

router.post('/progress/:courseId/lesson/:lessonId', markLessonCompleted);
router.delete('/progress/:courseId/lesson/:lessonId', unmarkLessonCompleted);
router.get('/progress/:courseId', getCourseProgress);

router.get('/course/:courseId/students', countCourseStudents);

export default router;
