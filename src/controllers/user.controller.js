import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js'


const registerUser = asyncHandler(async (req, res) => {
    // get user data from frontend
    // validation - not empty
    // check if user already exists
    // check for images, avatar
    // upload images to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return response to frontend

    const {fullName, email, userName, password} = req.body;
    // console.log("email: ", email);

    if (
        [fullName, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
        if (existedUser) {
            throw new ApiError(409, "User already exists");
        }

        const avatarLocalPath = req.files?.avatar[0]?.path; // path to the avatar image
        // const coverImageLocalPath = req.files?.coverImages[0]?.path; // array of paths to the cover images
        let coverImageLocalPath;
        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path
        }


        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar image is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if (!avatar) {
            throw new ApiError(500, "Avatar image upload failed");
        }

        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "" ,
            email,
            password,
            userName: userName.toLowerCase(),
       
    })
        
    const createdUser = await User.findById(User._id).select('-password -refreshToken');

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );


    });




export {registerUser};