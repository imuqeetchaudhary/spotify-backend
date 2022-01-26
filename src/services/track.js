const mongoose = require("mongoose");

exports.getAllTrackFiles = async () => {
  const TracksFiles = mongoose.connection.db.collection("tracks.files");
  try {
    const files = await TracksFiles.find().toArray();
    return files;
  } catch (err) {
    throw new Error(err);
  }
};
