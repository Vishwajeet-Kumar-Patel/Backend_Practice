import { Router } from "express";
import {toggleSubscription, getUserChannelSubscribers, getUserSubscriptions} from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT); // Protect all routes in this file

router.post("/channels/:channelId/subscribe", toggleSubscription);
router.get("/channels/:channelId/subscribers", getUserChannelSubscribers);
router.get("/channels/:channelId/subscriptions", getUserSubscriptions);

export default router;