const { Router } = require('express');
const { sendOtp, resendOtp, verifyOtp, update, profileImage, removeImage } = require('../../controllers/passager/authController');
const { uploadSingle } = require('../../middlewares/profileImageUploadMiddleware');
const authRouter = Router();

authRouter.post('/send-otp', sendOtp);
authRouter.post('/resend-otp', resendOtp);
authRouter.post('/verify-otp', verifyOtp);
authRouter.put('/update-details/:id', update);
authRouter.put('/update-profile-image/:id', uploadSingle, profileImage);
authRouter.delete('/remove-image/:id', removeImage)

module.exports = authRouter;

