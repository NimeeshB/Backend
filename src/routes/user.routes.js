import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  //upload aaya hia multer se, it is a middleware
  upload.fields([
    {
      name: "avatar", //ye fields frontend me bhi same name se rehni chahiye
      maxCount: 1,
    },
    {
      name: "coverImage", //ye fields frontend me bhi same name se rehni chahiye ,
      maxCount: 1,
    },
  ]),
  registerUser
); // http://localhost:8000/users/register par request anepe registerUser method execute hogi
//register method execute hone se pehele hame avatar, coverimage save karna hai local storage me

router.route("/login").post(loginUser);

//secured routes: ye routes hit karne ke liye user logged in hona chaiye
router.route("/logout").post(verifyJWT, logoutUser); //verifyJWT middleware function hai jo logout function execute honese pehele execute hoga which will give us the user information which will eventually be used to logout the use

//user ka accesstoken expire hone ke baad usko naya accesstoken deneka endpoint
router.route("/refreshToken").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile); //username params se milega thats why such route

router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
