const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../utils/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.get('/verify/:token', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes (require JWT)
router.get('/user/status', authenticateToken, authController.getUserStatus);
router.put('/user/preferences', authenticateToken, authController.updatePreferences);
router.put('/user/profile', authenticateToken, authController.updateProfile);
router.put('/user/badges', authenticateToken, authController.addBadge);
router.post('/user/bookmark', authenticateToken, authController.addBookmark);
router.get('/user/bookmarks', authenticateToken, authController.getBookmarks);
router.delete('/user/bookmarks/:id', authenticateToken, authController.deleteBookmark);
router.delete('/user/profile', authenticateToken, authController.deleteAccount);

module.exports = router;