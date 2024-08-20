import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async(req,res) => { //express k through likhte hai toh req res rehta hia apne pas 
    res.status(200).json({
        message: "ok"
    })
})

export {registerUser}