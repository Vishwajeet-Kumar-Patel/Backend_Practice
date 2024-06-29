import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

// Define the schema for the Video model
const videoSchema = new Schema({
    videoFile: {
        type: String,         // URL to the video file stored on a service like Cloudinary
        required: true,       // Indicates that this field is mandatory
    },
    thumbnail: {
        type: String,         // URL to the thumbnail image stored on a service like Cloudinary
        required: true,       // Indicates that this field is mandatory
    },
    title: {
        type: String,         // Title of the video
        required: true,       // Indicates that this field is mandatory
    },
    duration: {
        type: Number,         // Duration of the video in seconds
        required: true,       // Indicates that this field is mandatory
    },
    description: {
        type: String,         // Description of the video content
        required: true,       // Indicates that this field is mandatory
    },
    view: {
        type: Number,         // Number of views for the video
        default: 0,           // Default value set to 0
    },
    isPublished: {
        type: Boolean,        // Indicates if the video is published or not
        default: true,        // Default value set to true
    },
    owner: {
        type: Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',                 // Specifies the collection to reference
    },
}, {
    timestamps: true            // Automatically adds createdAt and updatedAt timestamps
});

// Apply the pagination plugin to the schema
videoSchema.plugin(mongooseAggregatePaginate);

// Export the Video model based on the schema
export const Video = mongoose.model('Video', videoSchema);
