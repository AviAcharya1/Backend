const express = require('express');
const { body } = require('express-validator');
const bidController = require('../controllers/bid.control');
const isAuth = require('../middlewares/Authentication');

const router = express.Router();

router.post('/:adId', isAuth, bidController.addBid);

router.get('/:adId', isAuth, bidController.listBids);

module.exports = router;
