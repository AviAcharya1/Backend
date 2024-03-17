const express = require('express');
const {body} = require('express-validator')
const auctionController = require('../controllers/auction.control');
const isAuth = require('../middlewares/Authentication');

const router = express.Router();

router.get('/start/:adId', isAuth, auctionController.startAuction);

// router.post('/end/:adId', isAuth, auctionController.endAuction);

module.exports = router;
