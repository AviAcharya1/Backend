const express = require('express');
const { body } = require('express-validator');
const adController = require('../controllers/ad.control');
const isAuth = require('../middlewares/Authentication');

const routers = express.Router();

routers.post(
  '/',
  isAuth,
  [
    body('productName', 'Invalid productName').trim().not().isEmpty(),
    body('basePrice', 'Invalid basePrice').trim().isNumeric(),
    body('duration', 'Invalid duration').trim().isNumeric(),
  ],
  adController.addAd
);

routers.get('/', isAuth, adController.retrieveAds);

routers.get('/:id', isAuth, adController.findAd);

routers.put('/:id', isAuth, adController.updateAd);

routers.delete('/:id', isAuth, adController.deleteAd);

module.exports = routers;
