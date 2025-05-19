import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User}  from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId) // user find kiya bsed on user ID(kaunse user ke liye access and refresh token banana hai )
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //accesstoken toh user ko dedete hai b ut refresh token DB me save karte hai 
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false}) //save kiya in DB without the validations

        return {accessToken, refreshToken}
    } 
    catch (error) 
    {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
        
    }
}

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
    const fields = [
        { name: "Full Name", value: fullName },
        { name: "Email", value: email },
        { name: "Password", value: password },
        { name: "Username", value: userName }
    ];
    
    // Check if any field is undefined or an empty string
    const emptyField = fields.find(field => !field.value || (typeof field.value === 'string' && field.value.trim() === ""));
    
    if (emptyField) {
        throw new ApiError(400, `${emptyField.name} is required`);
    }
    
    // if ([fullName,email,password,userName,password].some((field) => field?.field.trim() === ""))
    //     {
    //     throw new ApiError(400,  `${field} is required`)
    // }

    // check if user already exists: username, email
    //ye find karega ki username or email already exist or not aur woh return karega
    //agar existed user mila toh aage proceed hi nahi karna hai
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }] // jitni values check karni hai yahape daldo
    })
    console.log("existedUser obj: ", existedUser)
    if(existedUser){
        throw new ApiError(409, "User with username or email already exist")
    }


    // check for images, check for avatar
    console.log("req.files: ", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path; //avatar ki first property ka path jo multer ne upload kiya hai local me  
    //const coverImageLocalPath =req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

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
    const user =  await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",  
        email,
        password,
        username: userName.toLowerCase() // saving the username in lowercase in DB 


    })

    //check user bana hai ki nai. Mongo DB har ek entry k sath _id field attach kar deta hai  
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"  // object milne se pehele, remove refresh token and password from the obj
    )   // agar user mila matlab entry create hua 
    console.log("createdUser obj", createdUser)
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while user registration")
    }

    //Now that user is created successfully, return respnse
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
    
    

})


const loginUser = asyncHandler(async (req, res) => 
    {
        //get the data from req body
        //username or email based login
        //find the user
        //password check karo, if wrong then boldo wrong pwd 
        //if correct then generate access and refresh token and send to user
        //send cookie


        //get the data from req body
        const {email , username, password} = req.body


        //check if username or email is entered by user
        if(!username && !email){
            throw new ApiError(400, "username or email is required ")
        }

        //now that we have username or email , we need to find that user in mongodb 
        const user = await User.findOne({
            $or: [{username}, {email}]
        })

        // agar user nahi mila matlab that user isnt registered 
        if(!user){
            throw new ApiError(404, "User does not exist! Please register")
        }

        //agar user milgaya toh pwd check karo aur login karwao
        const isPasswordValid = await user.isPasswordCorrect(password) // ye password req.body se jo aaya hai woh hai 

        
        if(!isPasswordValid)
        {
        throw new ApiError(401, "Incorrect Password")
        }

        //Ab yaha tak agaya control matlab user ka username and pwd sahi hai 
        //yahape access aur refresh token generate hoga 
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

        //ab jo loggedin user hai usko cookies me bhejenge. Password and refresh token chodke baaki fields dedo
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        //cookies bhejne ke liye options hote hai 
        const options = {
            httpOnly: true, // ye do options se cookies bas server se modifiable hongi, frontend se nahi hoti, though front end pe dikhengi 
            secure: true 
        }
        
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)  // access and refresh token set karliya in cookie
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                user: loggedInUser , accessToken, refreshToken
                },
        "User logged in successfully")
        )

    })

const logoutUser = asyncHandler(async(req, res) => {
        //User find kiya using the middleware and refreshtoken hai usko undefined karneka for logout 
        await User.findByIdAndUpdate(
            req.user._id,
            {         
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        )
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .clearCookie("accessToken", options) //logout karke cookies clear kardiye
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
    }) 

// access token short lived rehta hai, refresh token ka itna hi kaam hai ki user ko baar baar email aur password na dena pade 
// assuming ek din ka hai access token toh ek din k baad user ko wapis email password dalke re login karna pdega 
// access token kahi saved nahi hota, refresh token DB me saved rehta hai 
// agar user ka access token expire hogaya hia toh usko 401 Unauthorized request aayegi, toh frontend wala ye kar sakta hia ki ek endpoint hit karwa sakta hai jahase access token refresh hoga
// toh woh request ke sath ek refresh token jata hai aur hamare backend me stored hai refresh token which can be used to match the one that has come from the use
// agar same hai toh dubara se session start karenge

//endpoint jahape user ka token refresh hoga
const refreshAccessToken = asyncHandler( async ( req, res) => {
    //user ka refreshtoken cookies me hamne save karke rakha hai toh wahise access karenge
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken // agar koi mobile app use kar raha hai toh cookies me se naa aake body se aayega

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        //verifying the incoming token with our token which is stored in DB
        //user ke pass jo token hai woh encypted token hai aur hame raw token chahiye jo DB me saved hai
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        
        //jab bhi refresh token banaya tha tab ._id use kia tha sign karne toh id ki information hogi refreshtoken me 
        //we will use that information to get the used id and find that user in DB and get that save refresh token to compare it with the incoming refresh token
    
        const user = await User.findById(decodedToken?._id)
    
        
        if(!user){
            throw new ApiError(401,  "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, " refresh token is expired or used")
        }
    
        //options can be stored globally as they are used frequently 
        const options = {
            http: true, 
            secured: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, newRefreshToken},
                "AccessToken refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
        
    }
})

export 
{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken  
}