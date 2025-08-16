const { Router } = require('express');
const { sendOtp, resendOtp, verifyOtp, update } = require('../../controllers/passager/authController');
const authRouter = Router();

authRouter.post('/send-otp', sendOtp);
authRouter.post('/resend-otp', resendOtp);
authRouter.post('/verify-otp', verifyOtp);
authRouter.put('/update-details/:id', update)

module.exports = authRouter;

