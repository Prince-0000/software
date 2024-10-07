// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile, getAllUsers, createOrUpdateUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/users', getAllUsers);
router.get('/profile', protect, getUserProfile);
router.post('/create-update', createOrUpdateUser);

module.exports = router;
