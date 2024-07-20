import { Router } from "express";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comments.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Protect all routes in this file

router.post("/comments", verifyJWT, addComment);
router.get("/comments/:videoId", getVideoComments);
router.put("/comments/:commentId", verifyJWT, updateComment);
router.delete("/comments/:commentId", verifyJWT, deleteComment);

export default router;