const { Router } = require('express');
const { sendOtp, resendOtp, verifyOtp, registerDocuments, updateBadgeImage, updateRearSeatsImage, updateFrontSeatsImage, updateDriverIdBack, updateDriverIdFront, updateDriverLicenseBack, updateDriverLicenseFront, profileImage, userData} = require('../../controllers/driver/authController');
const { uploadMultipleDocuments } = require('../../middlewares/uploadDriverDocuments');
const { uploadBadgeImage, uploadRearSeatsImage, uploadFrontSeatsImage, uploadDriverLicenseBack, uploadDriverLicenseFront, uploadDriverIdBack, uploadDriverIdFront } = require('../../middlewares/uploadSingle');
const { uploadSingle } = require('../../middlewares/profileImageUploadMiddleware');
const authDriverRouter = Router();

authDriverRouter.post('/send-otp', sendOtp);
authDriverRouter.post('/resend-otp', resendOtp);
authDriverRouter.post('/verify-otp', verifyOtp);
authDriverRouter.put('/document-submission/:id', uploadMultipleDocuments, registerDocuments);

authDriverRouter.get('/user-data/:id', userData);

authDriverRouter.put('/update-id-front/:id',uploadDriverIdFront, updateDriverIdFront);
authDriverRouter.put('/update-id-back/:id',uploadDriverIdBack, updateDriverIdBack);
authDriverRouter.put('/update-license-front/:id',uploadDriverLicenseFront, updateDriverLicenseFront);
authDriverRouter.put('/update-license-back/:id',uploadDriverLicenseBack, updateDriverLicenseBack);
authDriverRouter.put('/update-front-seats/:id',uploadFrontSeatsImage, updateFrontSeatsImage);
authDriverRouter.put('/update-rear-seats/:id',uploadRearSeatsImage, updateRearSeatsImage);
authDriverRouter.put('/update-badge/:id',uploadBadgeImage, updateBadgeImage);
authDriverRouter.put('/update-profile-image/:id', uploadSingle, profileImage);

module.exports = authDriverRouter;