const Room = require('../models/Store.schema');

// @route   POST /room/join/:roomId
// @desc    Add user to a room
exports.joinRoom = async (req, res, next) => {
  const { user } = req;
  const { roomId } = req.params;

  try {
    let room = await Room.findByIdAndUpdate(
      roomId,
      { $addToSet: { users: user._id } },
      { new: true }
    ).populate('users', { password: 0 });

    if (!room) {
      return res.status(404).json({ errors: [{ msg: 'Room not found' }] });
    }

    res.status(200).json({ msg: 'Successfully joined', room });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

// @route   GET /room/:roomId
// @desc    Get room details
exports.getRoom = async (req, res, next) => {
  const { roomId } = req.params;

  try {
    let room = await Room.findById(roomId).populate('users', { password: 0 });
    if (!room) {
      return res.status(404).json({ errors: [{ msg: 'Room not found' }] });
    }

    res.status(200).json(room);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};
