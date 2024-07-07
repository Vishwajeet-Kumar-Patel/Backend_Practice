import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, // user id
        ref: "User",
        required: true
    },

    channel: {
        type: mongoose.Schema.Types.ObjectId, // channel id
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }


}, {timestamps: true});





export const Subscription = mongoose.model("Subscription", subscriptionSchema);