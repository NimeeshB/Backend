import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/user.controller.js";
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

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser) //verifyJWT middleware function hai jo logout function execute honese pehele execute hoga which will give us the user information which will eventually be used to logout the use  

export default router