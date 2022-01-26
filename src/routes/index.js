const express = require("express");
const router = express.Router();

const user = require("./user");
const track = require("./track");

router.use("/user", user);
router.use("/tracks", track);

module.exports = router;
