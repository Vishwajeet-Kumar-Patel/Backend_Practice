import multer from "multer";


const storage = multer.diskStorage({  // diskStorage is a method of multer
    destination: function (req, file, cb) { // cb is callback
      cb(null, "./public/temp") // null is error
    },
    filename: function (req, file, cb) {
      /* const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // unique name for the file
      cb(null, file.fieldname + '-' + uniqueSuffix) */
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ 
    storage, 
   })