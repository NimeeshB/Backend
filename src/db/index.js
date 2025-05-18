import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MONGODB connected!! DBHOST: ${connectionInstance.connection.host}`); // database prod,dev,pipeline ka alag rehta hai toh hame pata chalta hai kaunse host pe cnnect ho rhe hai iss log se 
        console.log(`This is from the db/index file ${connectionInstance}`)

        
    } catch (error) {
        console.error("MONGODB connection error ", error)
        process.exit(1)
        
    }
}

export default connectDB;