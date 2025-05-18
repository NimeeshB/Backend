import mongoose, {Schema} from "mongoose";
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema ({
    username: 
    { 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // ye field ko index true iya hai because isko searchable banana hai. based on username mostly search karenge DB me 
    },
    email: 
    { 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,  // indexing thoda soch samajhke karna hai nai toh performance ki band bajegi  
    },
    fullName: 
    { 
        type: String,
        required: true,
        trim: true, 
        index: true 
    },
    avatar:
    { 
        type: String, // cloudinary url to be used. Its a service like AWS which helps us to store files, images, videos 
        required: true,
        trim: true,   
    },
    coverImage: 
    { 
        type: String, // cloudinary url to be used. Its a service like AWS which helps us to store files, images, videos         
    },
    watchHistory: [{ 
        type: Schema.Types.ObjectId,
        ref: "Video"        
    }],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    },

},
{
    timestamps: true
})

userSchema.pre("save", async function(next) { // middleware hai toh next ka access hoga , sabse end me next ko call karna padta hai so that the flag is passed to next middleware
    if (!this.isModified("password"))return next();

    this.password = await bcrypt.hash(this.password, 10) //yahape pwd encrpyt hoga
    
}) //jab bhi data save hona hai uske pehele password encrypt karna hai. Isme arrow function nahi use kar sakte because arrow function k andar this ka reference nahi hota. context nahi hota 
//problem ye hai ki jab bhi data save hoga tab function call hoga, agar avatar change kiya user ne tab bhi function call hoga which we dont want . toh jab password field ka modification bheju tab hi function run karna hai 

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password) //yahape check hoga ki password jo type kiya hia user ne aur encypted password correct hai ki nai 
}


//agar user ka auto logout 15 min me hojata hai toh wapis login karne se acha user se ek endpoint hit karwate hai wahape check hota hai ki user ke pas jo refresh token hai aur database me jo saved refresh token hai woh same hue toh user ko naya access token dete hai to authenticate 
userSchema.methods.generateAccessToken = function(){ //access token short lived rehta hai aur refresh token long lived 
    return jwt.sign(
        {
            _id: this._id, //payload that you want to save in  the token
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)