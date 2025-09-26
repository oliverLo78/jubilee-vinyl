// server/models/Design.js
const { Schema, model } = require('mongoose');

const designSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  trackInfo: {
    trackId: String,
    trackName: String,
    artistName: String,
    albumName: String,
    albumImage: String
  },
  designSettings: {
    textColor: String,
    fontFamily: String,
    // Add more settings as needed
  }
}, {
  timestamps: true
});

module.exports = model('Design', designSchema);