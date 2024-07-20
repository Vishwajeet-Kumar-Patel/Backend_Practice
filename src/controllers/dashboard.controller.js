import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel id')
    }
    const videos = await Video.find({channel: channelId})
    const subscribers = await Subscription.countDocuments({channel: channelId, active: true})
    const likes = await Like.countDocuments({video: {$in: videos.map(video => video._id)}})
    res.json(new ApiResponse({videos: videos.length, subscribers, likes}))
}
)

const getChannelVideos = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel id')
    }
    const videos = await Video.find({channel: channelId})
    res.json(new ApiResponse(videos))
}
)

export {getChannelStats, getChannelVideos};