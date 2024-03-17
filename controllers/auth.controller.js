const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User.schema');

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const payload = {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
      if (err) {
        throw err;
      }
      res.status(200).json({ token });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
