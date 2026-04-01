const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const usersController = require('../controllers/usersController');

router.get('/', protect, usersController.getUsers);
router.get('/:email', protect, usersController.getUserByEmail);
router.post('/', usersController.createUser);
router.put('/:email', protect, usersController.updateUser);
router.delete('/:email', protect, usersController.deleteUser);

module.exports = router;