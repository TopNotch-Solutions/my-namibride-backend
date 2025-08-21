const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    walletID: {
    type: String,
    required: true,
  },
    time: {
      type: Date,
      required: true,
    },
    referrence: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "earning", "transfer"],
      default: "deposit",
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

const Transaction = mongoose.model("transaction", transactionSchema);
module.exports = Transaction;
