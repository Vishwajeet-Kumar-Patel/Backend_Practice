import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller";

const router = Router();

router.use(verifyJWT); // Protect all routes in this file

router.get("/healthcheck", healthcheck);

export default router;