import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video id')
    }
    const comments = await Comment.find({video: videoId, replyTo: null})
    res.json(new ApiResponse(comments))
}
)

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video id')
    }
    const {text} = req.body
    const comment = new Comment({text, video: videoId, user: req.user._id})
    await comment.save()
    res.json(new ApiResponse(comment))
})

const deleteComment = asyncHandler(async (req, res) => {
    const {id} = req.params
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid comment id')
    }
    const comment = await Comment.findById(id)
    if (!comment) {
        throw new ApiError(404, 'Comment not found')
    }
    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized to delete this comment')
    }
    await comment.remove()
    res.json(new ApiResponse())
})

const updateComment = asyncHandler(async (req, res) => {
    const {id} = req.params
    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid comment id')
    }
    const comment = await Comment.findById(id)
    if (!comment) {
        throw new ApiError(404, 'Comment not found')
    }
    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized to update this comment')
    }
    const {text} = req.body
    comment.text = text
    await comment.save()
    res.json(new ApiResponse(comment))
})

export {getVideoComments, addComment, deleteComment, updateComment};