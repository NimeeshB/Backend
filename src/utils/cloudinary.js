// user multer k through file upload karega aur multer se file leke local storage me save karenge aur cloudinary woh local file lega aur cloud(server) pe upload kardega 
//server se local path path milega which will be used by cloudinary 

import { v2 as cloudinary} from "cloudinary";
import fs from "fs"; // file system from nodejs

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try
    {
        if(!localFilePath) return null;
        else
        {
            //if we have the local file path then upload to cloudinary
            const response= await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            //file has been uploaded successfully
            console.log("File uploaded on cloudinary")
            console.log("response url: ",response.url)
            fs.unlinkSync(localFilePath)
            return response;
        }
    }
    catch(error)
    {
            fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
            return null;
    }

}

export {uploadOnCloudinary};