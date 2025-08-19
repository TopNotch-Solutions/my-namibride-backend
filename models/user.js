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
    PreviousBalance: {
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
    driverIDFront: {
        type: String,
        required: false,
    },
    driverIDback: {
        type: String,
        required: false,
    },
    licenseFront: {
        type: String,
        required: false,
    },
    licenseBack: {
        type: String,
        required: false,
    },
    frontSeats: {
        type: String,
        required: false,
    },
    licensePlate: {
        type: String,
        required: false,
    },
    rearSeats: {
        type: String,
        required: false,
    },
    badge: {
        type: String,
        required: false,
    },
    drivingZone: {
        type: String,
        required: false,
    },
    profileImage:{
        type: String,
        required: false
    },
    verifiedCellphoneNumber: {
        type: String,
        required: true
    },
    visibility:{
        type: String,
        enum: ['Online', 'Offline'],
        default: 'Offline',
        required: false
    },
    accountDeactivation:{
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
})

const User = mongoose.model('user', userSchema);
module.exports = User;