import { Router } from "express";
import {
    addVideo,
    deleteVideo,
    getVideo,
    getVideos,
    updateVideo,
} from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJWT); // Protect all routes in this file

router.get("/videos", getVideos);
router.get("/videos/:id", getVideo);
router.post("/videos", addVideo);
router.put("/videos/:id", updateVideo);
router.delete("/videos/:id", deleteVideo);


export default router;