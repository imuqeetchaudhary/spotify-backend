const { TrackFile } = require("../db/models/track");

exports.getAllTrackFiles = async () => {
  try {
    const files = await TrackFile.find();
    return files;
  } catch (err) {
    throw new Error(err);
  }
};
