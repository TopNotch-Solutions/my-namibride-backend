const { Router } = require('express');
const { createIssue, all, remove } = require('../../controllers/passager/issueController');
const issuePassagerRouter = Router();

issuePassagerRouter.post('/create-issue/:id', createIssue);
issuePassagerRouter.get('/all-issues/:id', all);
issuePassagerRouter.delete('/remove-issue/:id', remove)

module.exports = issuePassagerRouter;