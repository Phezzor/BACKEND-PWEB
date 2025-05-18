const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const {login} = require('../controllers/authControllers');

router.post('/register', authController.register);
router.post('/login',login);

module.exports = router;
