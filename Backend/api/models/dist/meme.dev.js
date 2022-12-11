"use strict";

var mongoose = require('mongoose');

var memeSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true // unique: true

  },
  description: {
    type: String // required: true

  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  memeImage: {
    type: String
  }
});
module.exports = mongoose.model('meme', memeSchema);