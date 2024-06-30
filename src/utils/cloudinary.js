import { v2 as Cloudinary} from 'cloudinary'; 
import fs from 'fs';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //Upload the file on cloudinary
        const response = await cloudinary.v2.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        // File has been uploaded succesfully
        console.log("File uploaded successfully", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the lacally saved temporarily file as the upload failed
        return null;
    }
}    






cloudinary.v2.uploader.upload = ('https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
     {public_id: "shoes"},
function(error, result) {
    if (error) {
        console.error(error);
    } else {
        console.log(result);
    }
});