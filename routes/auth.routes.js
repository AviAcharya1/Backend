const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const isAuth = require('../middlewares/Authentication');

const router = express.Router();

router.post(
  '/',
  [
    body('email', 'Invalid credentials').isEmail(),
    body('password', 'Invalid credentials').exists(),
  ],
  authController.login
);

router.get('/', isAuth, authController.getUser);

module.exports = router;
