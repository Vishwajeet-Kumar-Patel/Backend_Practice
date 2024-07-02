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

    const {fullName, email, username, password} = req.body;
    console.log("email: ", email);

    if (fullName === "" || email === "" || username === "" || password === "") {
        res.status(400);
        throw new ApiError("All fields are required");
    }

    const existedUser = User.findOne({email: email}, {username: username}).then(async (user) => {
        if (existedUser) {
            res.status(409);
            throw new ApiError("User already exists");
        }

        const avatarLocalPath = req.files?.avatar[0]?.path; // path to the avatar image
        const coverImageLocalPath = req.files?.coverImages[0]?.path; // array of paths to the cover images
       
        if (!avatarLocalPath) {
            res.status(400);
            throw new ApiError("Avatar image is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImages = await uploadOnCloudinary(coverImageLocalPath);

        if (!avatar) {
            res.status(500);
            throw new ApiError("Avatar image upload failed");
        }

        User.create({
            fullName,
            avatar: avatar.url,
            coverImages: coverImages?.url || "" ,
            email,
            password,
            username: username.toLowerCase,
       
    })
        
    const createdUser = await User.findById(user._id).select('-password -refreshToken');

    if (!createdUser) {
        res.status(500);
            throw new ApiError("Something went wrong while resgistering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );


    });


});



export {registerUser};