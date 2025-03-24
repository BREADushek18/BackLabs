import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

router.post("/signup", authController.register);
router.post("/signin", authController.login);
router.get("/me", authController.getProfile);
router.delete("/me", authController.deleteUser);

export const authRoutes = router;
