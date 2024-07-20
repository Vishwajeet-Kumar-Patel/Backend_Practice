import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getVideos = asyncHandler(async (req, res, next) => {
    const videos = await Video.find().
        populate
        ({
            path: 'user',
            select: 'name email'
        }).
        populate
        ({
            path: 'likes',
            select: 'name email'
        }).
        populate
        ({
            path: 'dislikes',
            select: 'name email'
        }).
        populate
        ({
            path: 'comments',
            select: 'content'
        });
    res.json(new ApiResponse(videos));
}
);

const getVideo = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid video id');
    }
    const video = await Video.findById(id).
        populate
        ({
            path: 'user',
            select: 'name email'
        }).
        populate
        ({
            path: 'likes',
            select: 'name email'
        }).
        populate
        ({
            path: 'dislikes',
            select: 'name email'
        }).
        populate
        ({
            path: 'comments',
            select: 'content'
        });
    if (!video) {
        throw new ApiError(404, 'Video not found');
    }
    res.json(new ApiResponse(video));
}
);


const createVideo = asyncHandler(async (req, res, next) => {
    const {title, description, thumbnail, privacy} = req.body;
    const user = req.user;
    const video = new Video({title, description, thumbnail, privacy, user: user._id});
    await video.save();
    res.json(new ApiResponse(video));
}
);

const uploadVideo = asyncHandler(async (req, res, next) => {
    const {videoFile} = req.body;
    const user = req.user;
    const video = new Video({videoFile, user: user._id});
    await video.save();
    res.json(new ApiResponse(video));
}
);

const updateVideo = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid video id');
    }
    const {title, description, thumbnail, privacy} = req.body;
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, 'Video not found');
    }
    video.title = title;
    video.description = description;
    video.thumbnail = thumbnail;
    video.privacy = privacy;
    await video.save();
    res.json(new ApiResponse(video));
}
);

const deleteVideo = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid video id');
    }
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, 'Video not found');
    }
    await video.remove();
    res.json(new ApiResponse(video));
}
);

const togglePublishStatus = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid video id');
    }
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, 'Video not found');
    }
    video.isPublished = !video.isPublished;
    await video.save();
    res.json(new ApiResponse(video));
}
);

export {getVideos, getVideo, createVideo, uploadVideo, updateVideo, deleteVideo, togglePublishStatus};
// Path: src/controllers/user.controller.js