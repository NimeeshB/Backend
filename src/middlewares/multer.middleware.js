import multer from "multer";

const storage = multer.diskStorage({ // here we can either use disk storage or memory storage. We are using dist storage because memory can get full if there are large files 
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) { //cb is callback
      
      cb(null, file.originalname)
      console.log(file);
    }
  })
  
export const upload = multer({ 
    storage, 
})