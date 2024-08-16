import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema ({
    videoFile:  // id mongoDB khud generate karke dedeta hai 
    { // Mongodb allow karta hia choti choti media files save karne but load aata hia fir kafi  DB pe 
        type: String, //cloudinary url to be used
        required: true        
    },
    thumbnail: 
    { 
        type: String, //cloudinary url to be used
        required: true
    },
    title: 
    {
        type: String,
        required: true
    },
    description:
    { 
        type: String, 
        required: true          
    },
    duration: 
    { 
        type: Number, //    
        required: true    
    },
    views: [{ 
        type: Number,
        default: 0         
    }],
    isPublished: { // videos publically available hi ki nai woh check karne
        type: Boolean,
        default: 0
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"  
    }

},
{
    timestamps: true
})

//export karte hai uske pehele aggregate paginate use karna padta hia 
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)// mongoose model banayega jiska naam Video rahega and it will be based on videoSchema