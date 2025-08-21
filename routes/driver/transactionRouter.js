const { Router } = require('express');
const { fundOwnWallet, fundSomeonesWallet, wallet2Wallet, all } = require('../../controllers/driver/transactionController');
const transactionDriverRouter = Router();

transactionDriverRouter.post('/fund-own-wallet/:id', fundOwnWallet);
transactionDriverRouter.post('/fund-someones-wallet/:id', fundSomeonesWallet);
transactionDriverRouter.post('/wallet-to-wallet/:id', wallet2Wallet);
transactionDriverRouter.get('/all-transactions/:id', all)

module.exports = transactionDriverRouter;