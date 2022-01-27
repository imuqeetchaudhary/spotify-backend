const { TracksFile, TracksChunk } = require("../db/models/track");

exports.getAllTracksFiles = async () => {
  try {
    const files = await TracksFile.find();
    return files;
  } catch (err) {
    throw new Error(err);
  }
};

exports.getSingleTracksFile = async ({ id }) => {
  try {
    const file = await TracksFile.findById(id);
    return file;
  } catch (err) {
    throw new Error(err);
  }
};

exports.deleteTracksFile = async ({ id }) => {
  try {
    const message = await TracksFile.deleteOne({ _id: id });
    return message.deletedCount === 1
      ? "Successfully deleted track"
      : "Track doesn't exists";
  } catch (err) {
    throw new Error(err);
  }
};

exports.deleteTracksChunk = async ({ id }) => {
  try {
    const message = await TracksChunk.deleteMany({ files_id: id });
    return message.deletedCount === 1
      ? "Successfully deleted tracks chunk"
      : "Tracks chunk doesn't exists";
  } catch (err) {
    throw new Error(err);
  }
};
