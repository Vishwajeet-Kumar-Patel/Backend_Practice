import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    replyto: {
        type: Schema.Types.ObjectId,
        ref: 'Like'
    },
    like: {
        type: Boolean,
        default: true
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

likeSchema.plugin(mongooseAggregatePaginate);

export const Like = mongoose.model('Like', likeSchema);