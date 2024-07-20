import { Router } from "express";
import {toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT); // Protect all routes in this file

router.post("/videos/:videoId/like", toggleVideoLike);
router.post("/comments/:commentId/like", toggleCommentLike);
router.post("/tweets/:tweetId/like", toggleTweetLike);
router.get("/videos/liked", getLikedVideos);

export default router;