const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tracksFileSchema = new Schema({
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

exports.TracksFile = mongoose.model("Tracks.file", tracksFileSchema);
