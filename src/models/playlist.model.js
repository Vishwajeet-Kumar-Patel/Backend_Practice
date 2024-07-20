import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const playlistSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    description: {
        type: String
    },
    thumbnail: {
        type: String
    },
    privacy: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
}, {timestamps: true});

playlistSchema.plugin(mongooseAggregatePaginate);

export const Playlist = mongoose.model('Playlist', playlistSchema);