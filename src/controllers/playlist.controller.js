import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const playlist = new Playlist({name, description, user: req.user._id})
    await playlist.save()
    res.json(new ApiResponse(playlist))
}
)

const getPlaylists = asyncHandler(async (req, res) => {
    const playlists = await Playlist.find({user: req.user._id})
    res.json(new ApiResponse(playlists))
}
)

const getPlaylist = asyncHandler(async (req, res) => {
    const {id} = req.params
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid playlist id')
    }
    const playlist = await Playlist.findById(id)
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }
    res.json(new ApiResponse(playlist))
}
)

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {id} = req.params
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid playlist id')
    }
    const playlist = await Playlist.findById(id)
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }
    const {videoId} = req.body
    playlist.videos.push(videoId)
    await playlist.save()
    res.json(new ApiResponse(playlist))
}
)

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {id} = req.params
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid playlist id')
    }
    const playlist = await Playlist.findById(id)
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }
    const {videoId} = req.body
    playlist.videos = playlist.videos.filter(v => v.toString() !== videoId)
    await playlist.save()
    res.json(new ApiResponse(playlist))
}
)

const deletePlaylist = asyncHandler(async (req, res) => {
    const {id} = req.params
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid playlist id')
    }
    const playlist = await Playlist.findById(id)
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }
    await playlist.remove()
    res.json(new ApiResponse(playlist))
}
)

const updatePlaylist = asyncHandler(async (req, res) => {
    const {id} = req.params
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid playlist id')
    }
    const playlist = await Playlist.findById(id)
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }
    const {name, description} = req.body
    playlist.name = name
    playlist.description = description
    await playlist.save()
    res.json(new ApiResponse(playlist))
}
)

export {createPlaylist, getPlaylists, getPlaylist, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist};