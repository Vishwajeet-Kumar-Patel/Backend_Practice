import { Router } from "express";
import{
    getChannelStats,
    getChannelVideos
} from "../controllers/dashboard.controller.js";


const router = Router();

// router.use(verifyJWT); // Protect all routes in this file

router.get("/dashboard/channel-stats", getChannelStats);
router.get("/dashboard/channel-videos", getChannelVideos);

export default router;