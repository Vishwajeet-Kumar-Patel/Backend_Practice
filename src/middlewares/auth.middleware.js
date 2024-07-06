import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Get the access token from the request
        const accessToken = req.cookies?.accessToken  || req.headers('Authorization')?.split(' ')[1] || req.headers('x-access-token') || req.headers('accessToken') || req.body.accessToken || req.query;
    
        // If no access token is found, throw an error
        if (!accessToken) {
            return res.status(401).json({
                message: "No access token found"
            });
        }
    
        // Verify the access token
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        
        // Get the user from the database
        const user = await User.findById(decodedToken?._id).select('-password -refreshToken');
    
            if (user) { // If the access token is invalid, throw an error
                return ApiError(401, "Invalid access token");
            }
    
            // Set the user on the request
            req.user = user; // The user is now available on the request object
            next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
    });
