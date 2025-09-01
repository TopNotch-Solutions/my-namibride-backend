const Admin = require("../../models/admin");
const bcrypt = require("bcrypt");
const CapitalizeFirstLetter = require("../../utils/capitalizeFirstLetter");
const generateRandomString = require("../../utils/generateRandomString");
const path = require("path");
const fs = require("fs");

exports.create = async (req, res) => {
  const { firstName, lastName, email, department, contactNumber, role } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !role ||
    !department ||
    !contactNumber
  ) {
    return res
      .status(400)
      .json({ status: "FAILURE", message: "Input fields empty" });
  }
  try {
    const password = generateRandomString();
    const formattedFirstName = CapitalizeFirstLetter(firstName);
    const formattedLastName = CapitalizeFirstLetter(lastName);
    const formattedDepartment = CapitalizeFirstLetter(department);
    const formattedRole = CapitalizeFirstLetter(role);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        status: "FAILURE",
        message: "Admin with this email already exists",
      });
    }

    await Admin.create({
      firstName: formattedFirstName,
      lastName: formattedLastName,
      email,
      password: hashedPassword,
      department: formattedDepartment,
      contactNumber,
      role: formattedRole,
      profileImage: null,
    });
    console.log("New Admin's password: ", password);
    return res
      .status(201)
      .json({ status: "SUCCESS", message: "Admin created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(404)
      .json({ status: "FAILURE", message: "Input fields empty" });
  }
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ status: "FAILURE", message: "Admin not found" });
    }
    const existingUser = await bcrypt.compare(password, admin.password);
    if (existingUser) {
      return res
        .status(200)
        .json({ status: "SUCCESS", message: "Login successful", admin });
    }

    return res
      .status(404)
      .json({ status: "FAILURE", message: "Invalid credentials" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.updateDetails = async (req, res) => {
  const { firstName, lastName, email, department, contactNumber, role } =
    req.body;
  const { id } = req.params;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !role ||
    !department ||
    !contactNumber
  ) {
    return res
      .status(400)
      .json({ status: "FAILURE", message: "Input fields empty" });
  }
  if (!id) {
    return res
      .status(400)
      .json({ status: "FAILURE", message: "User ID not provided" });
  }
  try {
    const formattedFirstName = CapitalizeFirstLetter(firstName);
    const formattedLastName = CapitalizeFirstLetter(lastName);
    const formattedDepartment = CapitalizeFirstLetter(department);
    const formattedRole = CapitalizeFirstLetter(role);

    const existingAdmin = await Admin.findById(id);
    if (!existingAdmin) {
      return res.status(404).json({
        status: "FAILURE",
        message: "User not found",
      });
    }

    const updateUser = await Admin.findByIdAndUpdate(
      { _id: id },
      {
        firstName: formattedFirstName,
        lastName: formattedLastName,
        email,
        department: formattedDepartment,
        contactNumber,
        role: formattedRole,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({
        status: "SUCCESS",
        message: "Admin created successfully",
        data: updateUser,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ status: "FAILURE", message: "Input fields empty" });
  }
  try {
    const existingAdmin = await Admin.findById(id);
    if (!existingAdmin) {
      return res.status(404).json({
        status: "FAILURE",
        message: "User not found",
      });
    }
    const isExisting = await bcrypt.compare(
      currentPassword,
      existingAdmin.password
    );
    if (!isExisting) {
      return res.status(404).json({
        status: "FAILURE",
        message: "Invalid current password!",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(404).json({
        status: "FAILURE",
        message: "New password and the Confirm password provided do not match.",
      });
    }
    const salt = await bcrypt.genSalt();
    const newPasswordHashed = await bcrypt.hash(newPassword, salt);
    await Admin.findByIdAndUpdate(
      { _id: id },
      {
        password: newPasswordHashed,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ status: "SUCCESS", message: "Admin updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.updateProfileImage = async (req, res) => {
  const { id } = req.params;
  const profileImage = req.file ? req.file.filename : null;

  if (!profileImage || !id) {
    return res
      .status(400)
      .json({ status: "FAILURE", message: "Input fields empty" });
  }

  try {
    const user = await Admin.findOne({_id: id});
    if(!user){
      return res.status(404).json({ message: "User does not exist" });
    }

    if(user && user.profileImage){
      const profileImagePath = path.join("public", "profiles", user.profileImage);
      if (fs.existsSync(profileImagePath)) {
        fs.unlinkSync(profileImagePath);
      }
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { profileImage },
      { new: true }
    );

    if (!updatedAdmin) {
      return res
        .status(404)
        .json({ status: "FAILURE", message: "Admin not found" });
    }

    return res
      .status(200)
      .json({
        status: "SUCCESS",
        message: "Profile image updated successfully",
        data: updatedAdmin,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
