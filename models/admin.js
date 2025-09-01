const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Assuming email should be unique
    match: [
      /^\S+@\S+\.\S+$/,
      "Please use a valid email address",
    ], // A simple regex for email validation
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["Admin", "Super admin"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;