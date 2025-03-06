const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: true,
    unique: true
  },
  catwayType: {
    type: String,
    required: true,
    enum: ['long', 'short'],
    default: 'short'
  },
  catwayState: {
    type: String,
    required: true,
    default: 'disponible'
  }
});

module.exports = mongoose.model('Catway', catwaySchema);
