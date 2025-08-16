const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    cellphoneNumber: {
        type: String,
        required: true},
    otp: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date,
        required: true,
    },
    expireAt: { 
        type: Date,
        required: true,
    },    
},{
    timestamps: false,
})

const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP;