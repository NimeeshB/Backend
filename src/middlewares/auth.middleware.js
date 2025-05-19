import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//Ye middleware sirf verify karega ki user hai ya nai hai. logout me user ka access nai tha, toh user ko ye middle ware use karke logout karenge 

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {

        console.log("req.cookies: ", req.cookies)
        //ya toh cookies se token nikalo ya fir authorization header se 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") //Token Extraction: This code is designed to extract the authentication token from either the cookies or the Authorization header, which are the two common places where tokens might be stored and sent in HTTP requests. 
        
        console.log("token extracted from the request: ", token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        //agar token hai toh we use jwt to check if the token is correct 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)  //secret key that was used to sign the JWT when it was created. The same secret key is required to verify the token.
    
        //if the token is valid, jwt.verify also decodes the token, returning the payload (the data that was originally encoded into the token). This payload contains information like the user's ID, roles, and expiration time.(check user model when we generate the access token)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken") //then we get the id from the token and find the user for the logout operation
    
        if (!user) 
        {          
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user; // ab user milgaya hai toh req ke andar naya obj add kiya and usko user ka access dedete 
        console.log("req.user: ", req.user)
        next() // middlewares mostly routes ke andar use karte hai 
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})