const { Router } = require('express');
const { sendOtp, resendOtp, verifyOtp, registerDocuments} = require('../../controllers/driver/authController');
const { uploadMultipleDocuments } = require('../../middlewares/uploadDriverDocuments');
const authDriverRouter = Router();

authDriverRouter.post('/send-otp', sendOtp);
authDriverRouter.post('/resend-otp', resendOtp);
authDriverRouter.post('/verify-otp', verifyOtp);
authDriverRouter.put('/document-submission/:id', uploadMultipleDocuments, registerDocuments);

module.exports = authDriverRouter;