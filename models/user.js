const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: false
    },
    cellphoneNumber: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: false
    },
    walletID:{
        type: String,
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0.00,
    },
    address: {
        type: String,
        required: false,
    },
    role:{
        type: String,
        enum: ['passager', 'driver', 'fleet'],
        default: 'passager',
        required: true
    },
    verifiedCellphoneNumber: {
        type: String,
        required: true
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('user', userSchema);
module.exports = User;