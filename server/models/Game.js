const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  calledNumbers: {
    type: [Number],
    default: []
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema);
