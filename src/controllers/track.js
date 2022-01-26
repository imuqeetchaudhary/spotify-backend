const multer = require("multer");
const mongodb = require("mongodb");
const { MongoClient, ObjectId } = require("mongodb");

const { Readable } = require("stream");

// Database Configurations

let db;
MongoClient.connect("mongodb://localhost:27017", (err, database) => {
  if (err) {
    console.log(
      "MongoDB Connection Error. Please make sure that MongoDB is running"
    );
    process.exit(1);
  }
  db = database.db("spotify");
});

exports.postTrack = async (req, res) => {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    limits: { fields: 1, files: 1, parts: 2, fileSize: 6000000 },
  });

  upload.single("track")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message:
          "Upload Request Validation Failed. Maximun size of file should be less than or equal to 6 MBs",
      });
    } else if (!req.body.trackName) {
      return res.status(400).json({ message: "trackName is a required field" });
    }

    const trackName = req.body.trackName;

    // Convert Buffer into a Readable Stream

    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "tracks",
    });

    const uploadStream = bucket.openUploadStream(trackName, {
      metadata: {
        publisherId: new ObjectId(req.user._id),
      },
    });
    const id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on("error", () => {
      return res.status(500).json({ message: "Error Uploading File" });
    });

    uploadStream.on("finish", () => {
      res.status(201).json({
        message: `File uploaded successfully. You can access the file at the following url.`,
        type: `GET`,
        url: `http://localhost:8000/tracks/${id}`,
      });
    });
  });
};

exports.getTrack = async (req, res) => {
  let trackId;
  try {
    trackId = new ObjectId(req.params.trackId);
  } catch (err) {
    return res.status(400).json({
      message:
        "Invalid trackID in URL parameter. Must be a single string of 12 bytes or a string of 24 hex characters",
    });
  }

  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");

  const bucket = new mongodb.GridFSBucket(db, {
    bucketName: "tracks",
  });

  const downloadStream = bucket.openDownloadStream(trackId);

  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("error", () => {
    res.sendStatus(404);
  });

  downloadStream.on("end", () => {
    res.end();
  });
};
