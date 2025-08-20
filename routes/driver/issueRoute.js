const { Router } = require('express');
const { createIssue, all, remove } = require('../../controllers/driver/issueController');
const issueDriverRouter = Router();

issueDriverRouter.post('/create-issue/:id', createIssue);
issueDriverRouter.get('/all-issues/:id', all);
issueDriverRouter.delete('/remove-issue/:id', remove)

module.exports = issueDriverRouter;