const multer = require('multer')

const storage =  multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true)
    } else{
        cb({
           message: 'Unsupported file format' 
        }, file)
    }
}

const uploadMiddleware = multer({
    storage,
    limits: {
        fieldSize: 2000000
    },
    fileFilter: fileFilter
})

module.exports = uploadMiddleware