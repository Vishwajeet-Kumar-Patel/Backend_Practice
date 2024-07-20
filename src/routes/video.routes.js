import { Router } from "express";
import {getVideos, getVideo, createVideo, uploadVideo, updateVideo, deleteVideo, togglePublishStatus} from "../controllers/video.controller.js";

const router = Router();

//router.use(verifyJWT); // Protect all routes in this file

router.get("/videos", getVideos);
router.get("/videos/:id", getVideo);
router.post("/videos", createVideo);
router.put("/videos/:id", updateVideo);
router.delete("/videos/:id", deleteVideo);
router.post("/videos/upload", uploadVideo);
router.put("/videos/:id/publish", togglePublishStatus);

export default router;