import { Router } from "express";
import {createPlaylist, getPlaylists, getPlaylist, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist} from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT); // Protect all routes in this file

router.get("/playlists", getPlaylists);
router.get("/playlists/:id", getPlaylist);
router.post("/playlists", createPlaylist);
router.put("/playlists/:id", updatePlaylist);
router.delete("/playlists/:id", deletePlaylist);
router.post("/playlists/:id/videos", addVideoToPlaylist);
router.delete("/playlists/:id/videos/:videoId", removeVideoFromPlaylist);

export default router;