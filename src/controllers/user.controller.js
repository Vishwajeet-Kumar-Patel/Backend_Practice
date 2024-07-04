import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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

export { registerUser };
