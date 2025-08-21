const { Router } = require('express');
const { fundOwnWallet, fundSomeonesWallet, wallet2Wallet, all } = require('../../controllers/passager/transactionController');
const transactionPassagerRouter = Router();

transactionPassagerRouter.post('/fund-own-wallet/:id', fundOwnWallet);
transactionPassagerRouter.post('/fund-someones-wallet/:id', fundSomeonesWallet);
transactionPassagerRouter.post('/wallet-to-wallet/:id', wallet2Wallet);
transactionPassagerRouter.get('/all-transactions/:id', all)

module.exports = transactionPassagerRouter;