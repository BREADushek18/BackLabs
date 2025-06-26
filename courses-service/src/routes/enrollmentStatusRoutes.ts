import { Router } from 'express';
import { getEnrollmentStatus } from '../controllers/enrollmentStatusController';

const router = Router();

router.get('/status/:enrollmentId', getEnrollmentStatus);

export default router;
