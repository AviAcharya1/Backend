const { validationResult } = require('express-validator');
const Ad = require('../models/Ad.schema');
const Store = require('../models/Store.schema');
const User = require('../models/User.schema');
const io = require('../socket');

exports.addAd = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { productName, basePrice, duration, image, category, description } = req.body;
    duration = duration || 300;
    duration = Math.min(duration, 3600);
    image = image ? `${process.env.SERVER_BASE_URL}${image}` : '';
    const timer = duration;

    let ad = new Ad({
      productName,
      description,
      basePrice,
      currentPrice: basePrice,
      duration,
      timer,
      image,
      category,
      owner: req.user.id,
    });

    let store = new Store({ ad: ad._id });
    store = await store.save();

    ad.Store = store._id;
    ad = await ad.save();

    const user = await User.findById(ad.owner);
    user.postedAds.push(ad._id);
    await user.save();

    io.getIo().emit('addAd', { action: 'add', ad: ad });

    res.status(200).json({ ad, store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

exports.retrieveAds = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user, option } = req.query;
    let adList = [];
    if (user) {
      adList = await Ad.find({ owner: user }).sort({ createdAt: -1 });
    } else if (option === 'unexpired') {
      adList = await Ad.find({ auctionEnded: false }).sort({ createdAt: -1 });
    } else {
      adList = await Ad.find().sort({ createdAt: -1 });
    }
    res.status(200).json(adList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};


exports.findAd = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const adId = req.params.id; // id of type ObjectId (61a18153f926fdc2dd16d78b)
  try {
    const ad = await Ad.findById(adId).populate('owner', { password: 0 });
    if (!ad) return res.status(404).json({ errors: [{ msg: 'Ad not found' }] });
    res.status(200).json(ad);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

exports.updateAd = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const adId = req.params.id;
  try {
    // Check for authorization
    let ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ errors: [{ msg: 'Ad not found' }] });
    if (ad.owner != req.user.id)
      return res
        .status(401)
        .json({ errors: [{ msg: 'Unauthorized to delete this ad' }] });
    // Update all fields sent in body
    if (req.body.basePrice) {
      req.body.currentPrice = req.body.basePrice;
    }

    let updatedAd = await Ad.findByIdAndUpdate(adId, req.body);
    updatedAd = await Ad.findById(adId);

    res.status(200).json(updatedAd);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};


exports.deleteAd = async (req, res, next) => {
  const adId = req.params.id;
  try {
    let ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ errors: [{ msg: 'Ad not found' }] });
    if (ad.owner != req.user.id)
      return res
        .status(401)
        .json({ errors: [{ msg: 'Unauthorized to delete this ad' }] });
    if (ad.auctionStarted || ad.auctionEnded)
      return res
        .status(404)
        .json({ errors: [{ msg: 'Cannot delete, auction started/ended' }] });
    await Ad.deleteOne(ad);
    res.status(200).json({ msg: 'Deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};