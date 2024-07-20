import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getTweets = asyncHandler(async (req, res, next) => {
    const tweets = await Tweet.find().
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
    res.json(new ApiResponse(tweets));
}
);

const getTweet = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid tweet id');
    }
    const tweet = await Tweet.findById(id).
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
    res.json(new ApiResponse(tweet));
}
);

const createTweet = asyncHandler(async (req, res, next) => {
    const {content} = req.body;
    const user = req.user;
    const tweet = new Tweet({content, user: user._id});
    await tweet.save();
    res.json(new ApiResponse(tweet));
}
);

const likeTweet = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const user = req.user;
    const tweet = await Tweet.findById(id);
    if (!tweet) {
        throw new ApiError(404, 'Tweet not found');
    }
    if (tweet.likes.includes(user._id)) {
        throw new ApiError(400, 'Tweet already liked');
    }
    tweet.likes.push(user._id);
    await tweet.save();
    res.json(new ApiResponse(tweet));
}
);

const dislikeTweet = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const user = req.user;
    const tweet = await Tweet.findById(id);
    if (!tweet) {
        throw new ApiError(404, 'Tweet not found');
    }
    if (tweet.dislikes.includes(user._id)) {
        throw new ApiError(400, 'Tweet already disliked');
    }
    tweet.dislikes.push(user._id);
    await tweet.save();
    res.json(new ApiResponse(tweet));
}
);

export {getTweets, getTweet, createTweet, likeTweet, dislikeTweet}
// Path: src/controllers/user.controller.js