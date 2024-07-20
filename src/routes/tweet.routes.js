import { Router } from "express";
import{
    getTweet,
    getTweets,
    addTweet,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyJWT); // Protect all routes in this file

router.get("/tweets", getTweets);
router.get("/tweets/:id", getTweet);
router.post("/tweets", addTweet);
router.put("/tweets/:id", updateTweet);
router.delete("/tweets/:id", deleteTweet);

export default router;