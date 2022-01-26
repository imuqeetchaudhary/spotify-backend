const express = require("express");
const trackRouter = express.Router();
const trackController = require("../controllers/track");
const { authentication } = require("../middlewares/is-auth");

trackRouter.get(
  "/for-publisher",
  authentication,
  trackController.getAllTrackFilesForPublisher
);

trackRouter.post("/", authentication, trackController.postTrack);

trackRouter.get("/:trackId", trackController.getTrack);

trackRouter.get("/", trackController.getAllTrackFiles);

module.exports = trackRouter;
