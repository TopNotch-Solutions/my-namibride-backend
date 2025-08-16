const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { transporter } = require("./transporter");
require('dotenv').config()

const sendOTP = async ({ email, otp }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  try {
    const subject = "NamibRide OTP Verification for Registration";
    mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: `<p>Enter <b>${otp}</b> in the app to verify your phone number and complete your registration. <b>OTP will expire in 5 minutes.</b></p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new Error("Error sending OTP email: " + error.message);
      }
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Internal server error");
  }
};

module.exports = sendOTP;
