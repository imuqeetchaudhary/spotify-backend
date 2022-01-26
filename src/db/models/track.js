const { Binary } = require("mongodb");
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

const tracksChunkSchema = new Schema({
  files_id: {
    type: Schema.Types.ObjectId,
  },
  n: {
    type: Number,
  },
});

exports.TracksFile = mongoose.model("Tracks.file", tracksFileSchema);
exports.TracksChunk = mongoose.model("Tracks.chunk", tracksChunkSchema);
