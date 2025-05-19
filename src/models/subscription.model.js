import mongoose, {Schema} from "mongoose";

const subcriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // One who is subscribing
        ref: "User"
    },
    channel:{ // one to whom subscriber is subscribing
        type: Schema.Types.ObjectId, // One who is subscribing
        ref: "User"
    }
},
{
    timestamps : true
})

export const Subcription = mongoose.model("Subscription", subcriptionSchema)