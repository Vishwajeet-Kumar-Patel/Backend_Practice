import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const registerUser = asyncHandler(async (req, res) => {
    // Get user data from the frontend
    const { fullName, email, userName, password } = req.body;

    // Validation: Check if all fields are provided and not empty
    if ([fullName, email, userName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists by email or username
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    // If user already exists, throw an error
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // Extract the file paths for avatar and cover image from the request
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;

    // Check if cover image is provided
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // If avatar image is not provided, throw an error
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    // Upload avatar image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // Upload cover image to Cloudinary if provided
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    // If avatar upload failed, throw an error
    if (!avatar) {
        throw new ApiError(500, "Avatar image upload failed");
    }

    // Create a new user object and save it to the database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase(),
    });

    // Remove password and refresh token from the response
    const createdUser = await User.findById(user._id).select('-password -refreshToken');

    // If user creation failed, throw an error
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Return a success response to the frontend
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});


const loginUser = asyncHandler(async (req, res) => {
    // Get user data from the frontend
    const { email, userName, password } = req.body;

    if (!email && !userName) {
        throw new ApiError(400, "Email or username is required");
    }

    // Validation: Check if email and password are provided
    if (!userName && !email) {
        throw new ApiError(400, "username or email is required")
    }

    // Check if user exists in the database
    const user = await User.findOne({ $or: [{ email }, { userName }]}); // Find user by email or username

    // If user does not exist, throw an error
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if the password is correct
    const isPasswordMatch = await user.isPasswordCorrect(password);

    // If password is incorrect, throw an error
    if (!isPasswordMatch) {
        throw new ApiError(401, "Invalid email or password");
    }
    
    // Generate a new refresh token
    const refreshToken = await user.generateRefreshToken();

    // Save the refresh token to the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false});

    // Generate a new access token
    const accessToken = await user.generateAccessToken();

    // Remove password and refresh token from the response
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    // Set the cookie options
    const options = {
         httpOnly: true,
         secure: true,
     };
     

     // Return the access token to the frontend
    return res.status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully")
    );

});


const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
})


const refreshAccssToken = asyncHandler(async (req, res) => {
    
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedTokem = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        )
    
        const user = await User.findById(decodedTokem._id);
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
    
        if (user?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token has been expired or used"); 
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken} = await user.generateAccessToken(user._id);
        const {newRefreshToken} = await user.generateRefreshToken(user._id);
    
        return res
        .status(200)
        .cookie("accessToken", user.accessToken, options)
        .cookie("refreshToken", user.newRefreshToken, options)
        .json(
            new ApiResponse(200, {accessToken, newRefreshToken}, "Access token refreshed successfully"),
        )
    
    } catch (error) {
        throw new ApiError(401, error?.message|| "Invalid refresh token");
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {currentPassword, newPassword} = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Current password and new password are required");
    }
    

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordMatch = await user.isPasswordCorrect(currentPassword); // Check if the current password is correct

    if (!isPasswordMatch) {
        throw new ApiError(401, "Invalid current password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false});  // Skip validation before saving

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));// Return a success response
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current User details retrieved successfully"));
});

const updateAccountDetails = asyncHandler(async(req, res) => {
    const { fullName, email, userName } = req.body; // Get user data from the frontend

    if (!fullName && !email && !userName) { // Check if at least one field is provided
        throw new ApiError(400, "At least one field is required to update");
    }

    

    const user = await User.findByIdAndUpdate( // Find user by id and update the details
        req.user._id,
        {
            $set: {
                fullName,
                email,
                userName: userName.toLowerCase(),
        }
        },
        {
            new: true,
            runValidators: true,
        }
    ).select('-password'); // Remove password and refresh token from the response

    if (!user) {
        throw new ApiError(500, "Something went wrong while updating the user");
    }

    return res.status(200).json(new ApiResponse(200, user, "User details updated successfully"));
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.files?.avatar[0]?.path; // Extract the file path for the avatar image

    // delete the previous avatar image from Cloudinary
    if (req.user.avatar) {
        const publicId = req.user.avatar.split('/').slice(-1)[0].split('.')[0]; // Extract the public id from the avatar URL
        await cloudinary.uploader.destroy(publicId); // Delete the image from Cloudinary
    }

    if (!avatarLocalPath) { // Check if avatar image is provided
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath); // Upload avatar image to Cloudinary

    if (!avatar.url) { // If avatar upload failed, throw an error
        throw new ApiError(500, "Avatar image upload failed");
    }

    const user = await User.findByIdAndUpdate( // Find user by id and update the avatar
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            }
        },
        {
            new: true,
            runValidators: true,
        }
    ).select('-password'); // Remove password and refresh token from the response

    if (!user) { // If user update failed, throw an error
        throw new ApiError(500, "Something went wrong while updating the avatar");
    }

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully")); // Return a success response
});    

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.files?.coverImage[0]?.path; // Extract the file path for the cover image

    if (!coverImageLocalPath) { // Check if cover image is provided
        throw new ApiError(400, "Cover image is required");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath); // Upload cover image to Cloudinary

    if (!coverImage.url) { // If cover image upload failed, throw an error
        throw new ApiError(500, "Cover image upload failed");
    }

    const user = await User.findByIdAndUpdate( // Find user by id and update the cover image
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url,
            }
        },
        {
            new: true,
            runValidators: true,
        }
    ).select('-password'); // Remove password and refresh token from the response

    if (!user) { // If user update failed, throw an error
        throw new ApiError(500, "Something went wrong while updating the cover image");
    }

    return res.status(200).json(new ApiResponse(200, user, "Cover image updated successfully")); // Return a success response
});    

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { userName } = req.params; // Get the username from the request parameters
    if (!userName?.trim()) { // Check if username is provided
        throw new ApiError(400, "username is missing") // If username is not provided, throw an error
    }

    const channel = await User.aggregate([ // Find the user by username and populate the subscribers and subscribedTo fields
        {
            $match: {
                username: userName?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res.status(200).json(new ApiResponse(200, User, "User channel profile retrieved successfully")); // Return a success response
});

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
});


export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccssToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};
