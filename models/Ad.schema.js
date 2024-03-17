const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    duration: { type: Number, default: 300 },
    timer: { type: Number, default: 300 },
    soldAt: { type: Date },
    image: { type: String },
    category: { type: String },
    auctionStarted: { type: Boolean, default: false },
    auctionEnded: { type: Boolean, default: false },
    sold: { type: Boolean, default: false },
    owner: { type: mongoose.Types.ObjectId, ref: 'user' },
    purchasedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
    currentBidder: { type: mongoose.Types.ObjectId, ref: 'user' },
    bids: [
      {
        user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
        amount: { type: Number, required: true },
        time: { type: Date, default: Date.now },
      },
    ],
    store: { type: mongoose.Types.ObjectId, ref: 'store' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ad', adSchema);
