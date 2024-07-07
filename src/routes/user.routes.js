import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginUser, logoutUser, refreshAccssToken } from "../controllers/user.controller.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 5
        }
    ]),
    registerUser
);

// Unsecured routes that do not require a valid access token
router.route('/login').post(loginUser)

// Secured routes that require a valid access token
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refresh-token').post(refreshAccssToken);

export default router;