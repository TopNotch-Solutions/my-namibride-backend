const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/drivers');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

module.exports = {
    uploadMultipleDocuments: upload.fields([
        { name: 'driverIdFront', maxCount: 1 },
        { name: 'driverIdBack', maxCount: 1 },
        { name: 'driverLicenseFront', maxCount: 1 },
        { name: 'driverLicenseBack', maxCount: 1 },
         { name: 'frontSeatsImage', maxCount: 1 },
        { name: 'rearSeatsImage', maxCount: 1 },
        { name: 'badgeImage', maxCount: 1 }
    ])
};