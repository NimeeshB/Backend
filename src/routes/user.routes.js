import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)// http://localhost:8000/users/register par request anepe registerUser method execute hogi 

export default router