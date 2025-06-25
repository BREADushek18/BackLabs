import express from 'express';
import {
  addCourseToFavourites,
  removeCourseFromFavourites,
  getTopFavourites,
  getMyFavourites,
} from '../controllers/courseFavouriteController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/:id', authenticateJWT, addCourseToFavourites);
router.delete('/:id', authenticateJWT, removeCourseFromFavourites);
router.get('/top/all', getTopFavourites);
router.get('/my/all', authenticateJWT, getMyFavourites);

export default router;
