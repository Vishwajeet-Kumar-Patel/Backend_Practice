import { Router } from "express";
import{getTweets, getTweet, createTweet, likeTweet, dislikeTweet} from "../controllers/tweet.controller.js";

const router = Router();

// router.use(verifyJWT); // Protect all routes in this file

router.get("/tweets", getTweets);
router.get("/tweets/:id", getTweet);
router.post("/tweets", createTweet);
router.put("/tweets/:id/like", likeTweet);
router.put("/tweets/:id/dislike", dislikeTweet);

export default router;