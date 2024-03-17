const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema(
  {
    ad: {
      type: mongoose.Types.ObjectId,
      ref: 'ad',
      required: true,
    },
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('room', StoreSchema);
