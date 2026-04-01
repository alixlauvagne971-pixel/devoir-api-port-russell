const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const loginLimiter = require('../middleware/loginLimiter');

router.post('/login', loginLimiter, authController.login);
router.get('/logout', authController.logout);
router.get('/me', protect, authController.me);

module.exports = router;