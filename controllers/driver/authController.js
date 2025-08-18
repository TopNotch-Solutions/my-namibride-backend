const sendOTP = require("../../utils/sendOtp");
const OTP = require("../../models/otp");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const walletIDGenerator = require("../../utils/walletGenerator");
const path = require("path");
const fs = require("fs");

exports.sendOtp = async (req, res) => {
  const { cellphone_number } = req.body;

  if (!cellphone_number) {
    return res.status(400).json({ message: "Cellphone number is required" });
  }

  try {
    const accountAlreadyExists = await User.findOne({
      cellphoneNumber: cellphone_number,
      isAccountVerified: true,
    });
    if (accountAlreadyExists) {
      return res
        .status(409)
        .json({
          message: "An account with this phone number is already verified.",
        });
    }
    // Generate OTP logic here
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const createdAt = new Date();
    const expireAt = new Date(createdAt.getTime() + 5 * 60000); // OTP valid for 5 minutes
    const salt = await bcrypt.genSalt();
    const hashedOTP = await bcrypt.hash(otp, salt);
    await OTP.deleteMany({ cellphoneNumber: cellphone_number }); // Remove any existing OTP for this number
    await OTP.create({
      cellphoneNumber: cellphone_number, // Use the correct field name
      otp: hashedOTP,
      createdAt: createdAt,
      expireAt: expireAt,
    });
    // const email = "pauluswilhelm85@gmail.com";
    // if (!email) {
    //     return res.status(400).json({ message: "Email is required" });
    // }
    // sendOTP({ email, otp });
    // // Send OTP via SMS logic here (not implemented in this snippet)
    console.log(`OTP for ${cellphone_number} is ${otp}`); // For testing purposes, log the OTP
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Error registering passager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resendOtp = async (req, res) => {
  const { cellphone_number } = req.body;

  if (!cellphone_number) {
    return res.status(400).json({ message: "Cellphone number is required" });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const createdAt = new Date();
    const expireAt = new Date(createdAt.getTime() + 5 * 60000); // OTP valid for 5 minutes
    const salt = await bcrypt.genSalt();
    const hashedOTP = await bcrypt.hash(otp, salt);
    await OTP.deleteMany({ cellphoneNumber: cellphone_number }); // Remove any existing OTP for this number
    await OTP.create({
      cellphoneNumber: cellphone_number, 
      otp: hashedOTP,
      createdAt: createdAt,
      expireAt: expireAt,
    });
    // const email = "pauluswilhelm85@gmail.com";
    // if (!email) {81
    //     return res.status(400).json({ message: "Email is required" });
    // }
    // sendOTP({ email, otp });
    // // Send OTP via SMS logic here (not implemented in this snippet)
    console.log(`OTP for ${cellphone_number} is ${otp}`);
    res.status(200).json({ message: "OTP resent successfully", otp });
  } catch (error) {
    console.error("Error registering passager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { cellphoneNumber, otp } = req.body;

  if (!cellphoneNumber) {
    return res.status(400).json({ message: "Cellphone number is required" });
  }
  if (!otp) {
    return res.status(400).json({ message: "OTP is required" });
  }
  try {
    const otpRecord = await OTP.findOne({ cellphoneNumber: cellphoneNumber });
    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "OTP not found for this cellphone number" });
    }
    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
      return res
        .status(400)
        .json({
          message:
            "The OTP you entered is incorrect. Please check the code & try again.",
        });
    }
    const currentTime = new Date();
    if (currentTime > otpRecord.expireAt) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    const accountAlreadyExists = await User.findOne({
      cellphoneNumber,
      isAccountVerified: true,
    });
    if (accountAlreadyExists) {
        console.log("Alreadyyyy81")
      return  res
      .status(201)
      .json({
        message: "OTP verified successfully & Driver successfully created",
        user: accountAlreadyExists,
      });
    }
    let walletId;
    let isWalletIdUnique = false;
    let attempts = 0;
    const maxAttempts = 20;
    
    while (!isWalletIdUnique && attempts < maxAttempts) {
      walletId = walletIDGenerator();
      if (!walletId) {
        return res.status(500).json({ message: "Something went wrong with walletID generation" });
      }

      const checkWalletID = await User.findOne({ walletID: walletId });
      if (!checkWalletID) {
        isWalletIdUnique = true; 
      }
      attempts++;
    }

    if (!isWalletIdUnique) {
      return res.status(500).json({ message: "Failed to generate a unique wallet ID after multiple attempts." });
    }
    const user = await User.create({
      role: "driver",
      cellphoneNumber: cellphoneNumber,
      walletID: walletId,
      verifiedCellphoneNumber: cellphoneNumber,
      isAccountVerified: true, 
    });
    await OTP.deleteOne({ cellphoneNumber: cellphoneNumber });
   return res
      .status(201)
      .json({
        message: "OTP verified successfully & Driver successfully created",
        user,
      });
  } catch (error) {
    console.error("Error registering passager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};