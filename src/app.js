import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" // server se user ka browser hai uski cookies access aur set karne use hota hai 

const app = express()
//app banne ke baad hi sab cors and cookie parser configure hota hai 

//some essential middleware in an Express.js application
app.use(cors({
    origin: process.env.CORS_ORIGIN, //kaun kaunse frontend se request allow karni hai 
    credentials: true  // Allows cookies and other credentials to be included in requests
}))// app.use() sare middleware ya configurations ke liye use hota hai. cors is a middleware. bichme checking hota hai to see if the url is whitelisted 


app.use(express.json({limit: "16kb" })) //This middleware is used to parse incoming JSON payloads from HTTP requests and make them accessible via req.body
app.use(express.urlencoded({extended: true, limit: "16kb"})) //This middleware is used to parse incoming requests with URL-encoded payloads (typically from HTML form submissions) and make them accessible via req.body.
app.use(express.static("public")) //This middleware serves static files (like images, CSS, JavaScript files, etc.) from the public directory.
//  How it works: When a request is made for a static asset, Express will look in the public directory to find and serve the file. For example, if you have a file public/styles.css, it would be accessible via http://yourdomain.com/styles.css.

app.use(cookieParser())

//routes import 
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/users",userRouter);// http://localhost:8000/users request aayi toh userRouter invoke hoga


export default app;