const sendOTP = require("../../utils/sendOtp");
const OTP = require("../../models/otp");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const walletIDGenerator = require("../../utils/walletGenerator");
const path = require("path");
const fs = require("fs");

const updateFile = async (id, fieldName, filename, res) => {
  try {

    const user = await User.findOne({_id: id});
    if(!user){
      return res.status(404).json({ message: "User does not exist" });
    }
    if(user['isDocumentVerified']){
      return res.status(409).json({ message: "Documents has already been approved. Please contact your admin." });
    }

    if(user && user[fieldName]){
          const profileImagePath = path.join("public", "drivers", user[fieldName]);
          if (fs.existsSync(profileImagePath)) {
            console.log("Removing previous", profileImagePath)
            fs.unlinkSync(profileImagePath);
          }
        }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { [fieldName]: filename ,isDriverProfileImageVerified: false},
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: `User successfully updated`,
      user: updatedUser,
    });
  } catch (error) {
    console.error(`Error updating ${fieldName}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
      return res.status(409).json({
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
      return res.status(400).json({
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
      console.log("Alreadyyyy81");
      return res.status(200).json({
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
        return res
          .status(500)
          .json({ message: "Something went wrong with walletID generation" });
      }

      const checkWalletID = await User.findOne({ walletID: walletId });
      if (!checkWalletID) {
        isWalletIdUnique = true;
      }
      attempts++;
    }

    if (!isWalletIdUnique) {
      return res.status(500).json({
        message:
          "Failed to generate a unique wallet ID after multiple attempts.",
      });
    }
    const user = await User.create({
      role: "driver",
      cellphoneNumber: cellphoneNumber,
      walletID: walletId,
      verifiedCellphoneNumber: cellphoneNumber,
      isAccountVerified: true,
    });
    await OTP.deleteOne({ cellphoneNumber: cellphoneNumber });
    return res.status(201).json({
      message: "OTP verified successfully & Driver successfully created",
      user,
    });
  } catch (error) {
    console.error("Error registering passager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.registerDocuments = async (req, res) => {
  const { id } = req.params;
   const files = req.files;
   console.log(files, id, req.body)
  const {
    driverFullName,
    driverAddress,
    licensePlate,
    carModel,
    drivingZone,
  } = req.body;
  const driverIdFront = files.driverIdFront
    ? files.driverIdFront[0].filename
    : null;
  const driverIdBack = files.driverIdBack
    ? files.driverIdBack[0].filename
    : null;
  const driverLicenseFront = files.driverLicenseFront
    ? files.driverLicenseFront[0].filename
    : null;
  const driverLicenseBack = files.driverLicenseBack
    ? files.driverLicenseBack[0].filename
    : null;
  const frontSeatsImage = files.frontSeatsImage
    ? files.frontSeatsImage[0].filename
    : null;
  const rearSeatsImage = files.rearSeatsImage
    ? files.rearSeatsImage[0].filename
    : null;
  const badgeImage = files.badgeImage ? files.badgeImage[0].filename : null;

  if (!id) {
    return res.status(400).json({ message: "User id is required" });
  }
  if (!driverFullName) {
    return res.status(400).json({ message: "Driver fullname is required" });
  }
  if (!driverAddress) {
    return res.status(400).json({ message: "Address is required" });
  }
  if (!licensePlate) {
    return res.status(400).json({ message: "License plate is required" });
  }
  if (!drivingZone) {
    return res.status(400).json({ message: "Driving zone is required" });
  }
  if (!driverIdFront) {
    return res.status(400).json({ message: "Image of font ID is required" });
  }
  if (!driverIdBack) {
    return res.status(400).json({ message: "Image of back ID is required" });
  }
  if (!driverLicenseFront) {
    return res.status(400).json({ message: "License front is required" });
  }
  if (!driverLicenseBack) {
    return res.status(400).json({ message: "License back is required" });
  }
  if (!frontSeatsImage) {
    return res.status(400).json({ message: "Front seats is required" });
  }
  if (!rearSeatsImage) {
    return res.status(400).json({ message: "Rear seats is required" });
  }
  if (!badgeImage) {
    return res.status(400).json({ message: "Badge is required" });
  }
  if (!carModel) {
    return res.status(400).json({ message: "Car model is required" });
  }
  try {
    const existingDriver = await User.findOne({ licensePlate });
    if (existingDriver) {
      return res.status(409).json({ message: "Vehicle already in use." });
    }

    const newDriver = await User.findByIdAndUpdate(
      { _id: id,
       },
      {
        fullname: driverFullName,
        address: driverAddress,
        drivingZone,
        licensePlate,
        carModel,
        isDocumentsSubmitted: true,
        driverIDFront: driverIdFront,
        driverIDback: driverIdBack,
        licenseFront: driverLicenseFront,
        licenseBack: driverLicenseBack,
        frontSeats: frontSeatsImage,
        rearSeats: rearSeatsImage,
        badge: badgeImage,
      },
      { new: true }
    );

    if (!newDriver) {
      return res.status(404).json({ message: "User does not exist" });
    }
    return res.status(200).json({
      message: "Driver documents successfully updated",
      user: newDriver,
    });
  } catch (error) {
    console.error("Error registering passager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateDriverIdFront = async (req, res) => {
  const { id } = req.params;
  const driverIdFront = req.file ? req.file.filename : null;

  console.log(id, driverIdFront)

  if (!id || !driverIdFront) {
    return res.status(400).json({ message: "User ID and file are required" });
  }
  await updateFile(id, "driverIDFront", driverIdFront, res);
};

exports.updateDriverIdBack = async (req, res) => {
  const { id } = req.params;
  const driverIdBack = req.file ? req.file.filename : null;

  if (!id || !driverIdBack) {
    return res.status(400).json({ message: "User ID and file are required" });
  }
  await updateFile(id, "driverIDback", driverIdBack, res);
};

exports.updateDriverLicenseFront = async (req, res) => {
  const { id } = req.params;
  const driverLicenseFront = req.file ? req.file.filename : null;

  if (!id || !driverLicenseFront) {
    return res.status(400).json({ message: "User ID and file are required" });
  }
  await updateFile(id, "licenseFront", driverLicenseFront, res);
};

exports.updateDriverLicenseBack = async (req, res) => {
  const { id } = req.params;
  const driverLicenseBack = req.file ? req.file.filename : null;

  if (!id || !driverLicenseBack) {
    return res.status(400).json({ message: "User ID and file are required" });
  }
  await updateFile(id, "licenseBack", driverLicenseBack, res);
};

exports.updateFrontSeatsImage = async (req, res) => {
  const { id } = req.params;
  const frontSeatsImage = req.file ? req.file.filename : null;

  if (!id || !frontSeatsImage) {
    return res.status(400).json({ message: "User ID and file are required" });
  }
  await updateFile(id, "frontSeats", frontSeatsImage, res);
};

exports.updateRearSeatsImage = async (req, res) => {
  const { id } = req.params;
  const rearSeatsImage = req.file ? req.file.filename : null;

  if (!id || !rearSeatsImage) {
    return res.status(400).json({ message: "User ID and file are required" });
  }
  await updateFile(id, "rearSeats", rearSeatsImage, res);
};

exports.updateBadgeImage = async (req, res) => {
  const { id } = req.params;
  const badgeImage = req.file ? req.file.filename : null;

  if (!id || !badgeImage) {
    return res.status(400).json({ message: "User ID and file are required" });
  }
  await updateFile(id, "badge", badgeImage, res);
};

exports.profileImage = async (req, res) => {
  const { id } = req.params;
  const profileImage = req.file ? req.file.filename : null;
  console.log("My i:", profileImage)
  if (!id) {
    return res.status(400).json({ message: "Please pass user id" });
  }

  if (!profileImage) {
    return res.status(400).json({ message: "Please pass profile image" });
  }

  try{
    
    const user = await User.findOne({_id: id});
    if(!user){
      return res.status(404).json({ message: "User does not exist" });
    }

    if(user && user.profileImage){
      const profileImagePath = path.join("public", "profiles", user.profileImage);
      if (fs.existsSync(profileImagePath)) {
        fs.unlinkSync(profileImagePath);
      }
    }
     const updatedUser = await User.findByIdAndUpdate(
      id,  
    { profileImage: profileImage,isDriverProfileImageVerified: false },
      { new: true }  
    );
    return res.status(200).json({
      success: true,
      message: "User successfully updated", 
      user: updatedUser
    });
  }catch (error) {
    console.error("Error updating user:", error);  
    res.status(500).json({ message: "Internal server error" });
  }
}