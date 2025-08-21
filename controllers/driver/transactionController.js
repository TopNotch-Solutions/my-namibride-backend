const Transaction = require("../../models/transaction");
const User = require("../../models/user");
const generateTransactionReference = require("../../utils/generateReferrence");

exports.fundOwnWallet = async (req, res) => {
  const { id } = req.params;
  const { amount, cardNumber, expiryDate, cvv } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User id is required" });
  }

  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }
  if (!cardNumber) {
    return res.status(400).json({ message: "Card number is required" });
  }
  if (!expiryDate) {
    return res.status(400).json({ message: "Card expiry date is required" });
  }
  if (!cvv) {
    return res.status(400).json({ message: "CVV is required" });
  }

  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const referrence = generateTransactionReference();
    const newAmount = parseFloat(amount);
    await Transaction.create({
      userId: id,
      amount: newAmount,
      walletID: user.walletID,
      time: new Date(),
      referrence,
      type: "deposit",
      status: "pending",
    });

    user.PreviousBalance = user.balance;
    user.balance = user.balance + parseFloat(amount);
    await user.save();

    const userUpdated = await User.findOne({ _id: id });
    const data = await Transaction.find({userId: id});
    return res.status(201).json({
      message: "Fund successfully deposited into own wallet.",
      user: userUpdated,
      data
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.fundSomeonesWallet = async (req, res) => {
  const { id } = req.params;
  const { amount, cardNumber, expiryDate, cvv, walletID } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User id is required" });
  }
  if (!walletID) {
    return res.status(400).json({ message: "Wallet id is required" });
  }
  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }
  if (!cardNumber) {
    return res.status(400).json({ message: "Card number is required" });
  }
  if (!expiryDate) {
    return res.status(400).json({ message: "Card expiry date is required" });
  }
  if (!cvv) {
    return res.status(400).json({ message: "CVV is required" });
  }

  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userFunded = await User.findOne({ walletID });
    if (!userFunded) {
      return res.status(404).json({ message: "User being funded not found." });
    }

    const referrence = generateTransactionReference();
    await Transaction.create({
      userId: id,
      amount: amount,
      walletID,
      time: new Date(),
      referrence,
      type: "deposit",
      status: "pending",
    });
    
    userFunded.PreviousBalance = userFunded.balance;
    userFunded.balance = userFunded.balance + parseFloat(amount);
    await userFunded.save();

    const userUpdated = await User.findOne({ _id: id });
    const data = await Transaction.find({userId: id});
    return res.status(201).json({
      message: "Transaction created successfully.",
       user: userUpdated, 
      data
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.wallet2Wallet = async (req, res) => {
  const { id } = req.params;
  const { amount, walletID } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User id is required" });
  }
  if (!walletID) {
    return res.status(400).json({ message: "Wallet id is required" });
  }
  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userFunded = await User.findOne({ walletID });
    if (!userFunded) {
      return res.status(404).json({ message: "User being funded not found." });
    }

    if (user.balance <= 0) {
      return res.status(400).json({ message: "There are no funds to transfer." });
    }

    if (user.balance < amount) {
      return res.status(400).json({
        message:
          "Current balance can't withstand a withdrawal amount exceeding balance.",
      });
    }

    const referrence = generateTransactionReference();
    await Transaction.create({
      userId: id,
      amount: amount,
      walletID,
      time: new Date(),
      referrence,
      type: "transfer",
      status: "completed",
    });

    user.PreviousBalance = user.balance;
    user.balance = user.balance - parseFloat(amount);
    await user.save();

    userFunded.PreviousBalance = userFunded.balance;
    userFunded.balance = userFunded.balance + parseFloat(amount);
    await userFunded.save();

    const userUpdated = await User.findOne({ _id: id });
    const data = await Transaction.find({userId: id});
    return res.status(200).json({
      message: "Transaction created successfully.",
       user: userUpdated, 
      data
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
exports.all = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "User id is required" });
  }
  try {
    const userTransactions = await Transaction.find({ userId: id });

    if (userTransactions.length === 0) {
      return res.status(200).json({
        message: "User's transactions retrieved",
        data: [],
      });
    }
    return res.status(200).json({
      message: "User's transactions retrieved",
      data: userTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};