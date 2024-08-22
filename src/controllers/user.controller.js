import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User}  from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res) => { //express k through likhte hai toh req res rehta hia apne pas 
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

     // get user details from frontend, mostly sab data req.body(form or json data) se aajta hai par jaruri nai ki wahise aaye , url se bhi aa sakta hai  
    const {fullName, email, userName, password} = req.body
    console.log('fullName: ', fullName , ', email: ', email)
    console.log("req.body: ", req.body)

    // validation - not empty
    if ([fullName,email,password,userName].some((field) => field?.field.trim() == ""))
        {
        throw new ApiError(400,  `${field} is required`)
    }

    // check if user already exists: username, email
    //ye find karega ki username or email already exist or not aur woh return karega
    //agar existed user mila toh aage proceed hi nahi karna hai
    const existedUser = User.findOne({
        $or: [{ username }, { email }] // jitni values check karni hai yahape daldo
    })
    console.log("existedUser obj: ", existedUser)
    if(existedUser){
        throw new ApiError(409, "User with username or email already exist")
    }


    // check for images, check for avatar
    console.log("req.files: ", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path; //avatar ki first property ka path jo multer ne upload kiya hai local me  
    const coverImageLocalPath =req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }


    // upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //avatar is a required field in db so we check if its null 
    if(!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // create user object - create entry in db. DB se toh bas USER model baat kar raha hai 
    const user = User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",  
        email,
        password,
        username: userName.ToLowerCase()


    })

    //check user bana hai ki nai. Mongo DB har ek entry k sath _id field attach kar deta hai  
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"  // remove refresh token and password from the obj
    )   // agar user mila matlab entry create hua 
    console.log("createdUser obj", createdUser)
    if(!createdUser){
        throw new ApiError(500, "Something went wrond while user registration")
    }

    //return respnse
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
    
    

})

export {registerUser}