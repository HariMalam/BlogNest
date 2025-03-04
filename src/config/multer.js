const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'temp/')
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname.split('.')[0] + '-' + uniqueSuffix + path.extname(file.originalname)); // Original filename with timestamp and extension
    }
});

const upload = multer({ storage: storage });

module.exports = {
    storage,
    upload
};