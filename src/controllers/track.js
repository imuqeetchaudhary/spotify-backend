const multer = require("multer");
const mongodb = require("mongodb");
const { MongoClient, ObjectId } = require("mongodb");
const { Readable } = require("stream");

const { promise } = require("../middlewares/promise");
const trackService = require("../services/track");

// Database Configurations

let db;
MongoClient.connect("mongodb://localhost:27017", (err, database) => {
  if (err) {
    console.log(
      "MongoDB Connection Error. Please make sure that MongoDB is running"
    );
    process.exit(1);
  }
  db = database.db(`${process.env.DB_NAME}`);
});

exports.postTrack = async (req, res) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "audio/mp3" || file.mimetype === "video/mpeg") {
      cb(null, true);
    } else {
      console.log(file.mimetype);
      cb(
        new Error(
          "File type not supported. Only mp3, mpeg file types are allowed"
        ),
        false
      );
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fields: 1, files: 1, parts: 2, fileSize: 1024 * 1024 * 16 },
  });

  upload.single("track")(req, res, (err) => {
    if (err) {
      console.log(err.message);
      return res.status(400).json({
        error: "Upload Request Validation Failed.",
        message: `${err.message}. Maximun file size should be less than 16MBs`,
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

exports.getAllTracksFiles = promise(async (req, res) => {
  const trackFiles = await trackService.getAllTracksFiles();

  res.status(200).json({ trackFiles });
});

exports.getAllTracksFilesForPublisher = promise(async (req, res) => {
  const trackFiles = await trackService.getAllTracksFiles();

  const filteredFiles = trackFiles.filter(
    (file) => file.metadata.publisherId == req.user._id
  );

  res.status(200).json({ trackFiles: filteredFiles });
});

exports.deleteTrack = promise(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const tracksFile = await trackService.getSingleTracksFile({ id });

  if (tracksFile === null)
    return res.status(400).json({
      message: "Track not found",
    });

  if (tracksFile.metadata.publisherId != userId)
    return res.status(400).json({
      message: "Only the track publisher can delete this track.",
    });

  const chunkMessage = await trackService.deleteTracksChunk({ id });

  const fileMessage = await trackService.deleteTracksFile({ id });

  res.status(200).json({ message: fileMessage });
});
