import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video id')
    }
    const like = await Like.findOne({video: videoId, user: req.user._id})
    if (like) {
        await like.remove()
    } else {
        await Like.create({video: videoId, user: req.user._id})
    }
    res.json(new ApiResponse())
}
)

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, 'Invalid comment id')
    }
    const like = await Like.findOne({comment: commentId, user: req.user._id})
    if (like) {
        await like.remove()
    } else {
        await Like.create({comment: commentId, user: req.user._id})
    }
    res.json(new ApiResponse())
}
)

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, 'Invalid tweet id')
    }
    const like = await Like.findOne({tweet: tweetId, user: req.user._id})
    if (like) {
        await like.remove()
    } else {
        await Like.create({tweet: tweetId, user: req.user._id})
    }
    res.json(new ApiResponse())
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.find({user: req.user._id, video: {$exists: true}})
    res.json(new ApiResponse(likes))
}
)

export {toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos};