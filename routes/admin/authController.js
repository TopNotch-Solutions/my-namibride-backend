const { Router } = require('express');
const { create, login, updateDetails, updateProfileImage } = require('../../controllers/admin/authController');
const { use } = require('react');
const { uploadSingle } = require('../../middlewares/profileImageUploadMiddleware');

const authAdminRouter = Router();

authAdminRouter.post('/create-admin', create);
authAdminRouter.post('/login', login);
authAdminRouter.put('/update-admin/:id', updateDetails);
authAdminRouter.put('/update-profile-image/:id', uploadSingle, updateProfileImage);

module.exports = authAdminRouter;