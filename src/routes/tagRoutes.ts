import { Router } from "express";
import { getTags, createTag, deleteTag } from "../controllers/tagController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.get("/tags", getTags);
router.post("/tags", authenticateJWT, createTag);
router.delete("/tags/:id", authenticateJWT, deleteTag);

export default router;
