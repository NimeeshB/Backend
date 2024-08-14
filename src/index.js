import mongoose from "mongoose";
import connectDB from "./db/index.js";
import { DB_NAME } from "./constants.js";
import dotenv from "dotenv"
import app from "./app.js";

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.on("error", (error) => { //part is good for catching server-level errors after the server has started 
        console.log('Err', error)
    })
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}` );
    }) //If the database connection is successful, the server starts listening on a port.
    //The app.listen() function in an Express.js application is used to start a server and have it listen for incoming requests on a specified port. Essentially, it tells your Node.js application to start accepting HTTP requests at a specific port and IP address.
}) 
.catch((error)=> {
    console.error("MONGODB connection failed!! ", error)
})