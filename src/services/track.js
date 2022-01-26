const { TracksFile } = require("../db/models/track");

exports.getAllTracksFiles = async () => {
  try {
    const files = await TracksFile.find();
    return files;
  } catch (err) {
    throw new Error(err);
  }
};
