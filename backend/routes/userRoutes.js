const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.loginUser);
router.get('/', userController.getAllUsers);
router.post('/register', userController.createUser);

module.exports = router;