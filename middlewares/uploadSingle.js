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
    uploadDriverIdFront: upload.single('driverIdFront'),
    uploadDriverIdBack: upload.single('driverIdBack'),
    uploadDriverLicenseFront: upload.single('driverLicenseFront'),
    uploadDriverLicenseBack: upload.single('driverLicenseBack'),
    uploadFrontSeatsImage: upload.single('frontSeatsImage'),
    uploadRearSeatsImage: upload.single('rearSeatsImage'),
    uploadBadgeImage: upload.single('badgeImage')
};