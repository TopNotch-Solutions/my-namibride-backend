const { Router } = require('express');
const { sendOtp, resendOtp, verifyOtp} = require('../../controllers/driver/authController');
const authDriverRouter = Router();

authDriverRouter.post('/send-otp', sendOtp);
authDriverRouter.post('/resend-otp', resendOtp);
authDriverRouter.post('/verify-otp', verifyOtp);

module.exports = authDriverRouter;