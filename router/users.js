const express = require('express');
const { SignUp, SignIn, changePassword } = require('../controller/users');
const router = express.Router();

router.post('/signup', SignUp);
router.post('/signin', SignIn);
router.post('/change-password', changePassword);

module.exports = router;
