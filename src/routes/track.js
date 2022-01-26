const express = require("express");
const trackRouter = express.Router();
const trackController = require("../controllers/track");
const { authentication } = require("../middlewares/is-auth");

trackRouter.get("/:trackId", trackController.getTrack);

trackRouter.post("/", authentication, trackController.postTrack);

module.exports = trackRouter;
