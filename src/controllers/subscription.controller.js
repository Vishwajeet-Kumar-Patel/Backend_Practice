import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid subscription id');
    }
    const subscription = await Subscription.findById(id);
    if (!subscription) {
        throw new ApiError(404, 'Subscription not found');
    }
    subscription.active = !subscription.active;
    await subscription.save();
    res.json(new ApiResponse(subscription));
}
);

const getUserChannelSubscribers = asyncHandler(async (req, res, next) => {
    const {userId} = req.params;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid user id');
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    const subscribers = await Subscription.find({channel: userId, active: true});
    res.json(new ApiResponse(subscribers));
}
);

const getUserSubscriptions = asyncHandler(async (req, res, next) => {
    const {userId} = req.params;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid user id');
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    const subscriptions = await Subscription.find({subscriber: userId, active: true});
    res.json(new ApiResponse(subscriptions));
}
);

export {toggleSubscription, getUserChannelSubscribers, getUserSubscriptions};

