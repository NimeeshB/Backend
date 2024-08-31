import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    //upload aaya hia multer se, it is a middleware 
    upload.fields([{
        name: "avatar", //ye fields frontend me bhi same name se rehni chahiye 
        maxCount: 1
    },{
        name: "coverImage", //ye fields frontend me bhi same name se rehni chahiye ,
        maxCount: 1
    }]),
    registerUser)// http://localhost:8000/users/register par request anepe registerUser method execute hogi
    //register method execute hone se pehele hame avatar, coverimage save karna hai local storage me 

    router.route("/login").post(loginUser)

//secured routes: ye routes hit karne ke liye user logged in hona chaiye 
router.route("/logout").post(verifyJWT,  logoutUser) //verifyJWT middleware function hai jo logout function execute honese pehele execute hoga which will give us the user information which will eventually be used to logout the use  

//user ka accesstoken expire hone ke baad usko naya accesstoken deneka endpoint 
router.route("/refreshToken").post( refreshAccessToken )

export default router