const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trackFileSchema = new Schema({
  length: {
    type: Number,
  },
  chunkSize: {
    type: Number,
  },
  uploadDate: {
    type: Date,
  },
  filename: {
    type: String,
  },
  metadata: {
    publisherId: Schema.Types.ObjectId,
  },
});

exports.TrackFile = mongoose.model("Tracks.file", trackFileSchema);
