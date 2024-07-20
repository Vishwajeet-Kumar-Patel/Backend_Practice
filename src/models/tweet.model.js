import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    }
}, {timestamps: true});

tweetSchema.plugin(mongooseAggregatePaginate);

export const Tweet = mongoose.model('Tweet', tweetSchema);