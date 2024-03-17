const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.control');
const isAuth = require('../middlewares/Authentication');

const router = express.Router();

router.post(
  '/',
  [
    body('username', 'Invalid name').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'Enter valid password with min length of 6 char').isLength({ min: 6 }),
  ],
  userController.registerUser
);

router.get('/:id', isAuth, userController.getUserById);

router.get('/products/purchased', isAuth, userController.purchasedProducts);

router.get('/products/posted', isAuth, userController.postedProducts);

module.exports = router;
