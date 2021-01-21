const express = require('express');
const userController = require('../controllers/userController.js')
const router = express.Router();

router.get('/signup', userController.getSignup);
router.get('/login', userController.getLogin);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);

module.exports = router;