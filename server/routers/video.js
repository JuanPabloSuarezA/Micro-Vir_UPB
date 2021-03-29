const express = require("express");

const VideoController = require("../controllers/video");

const router = express.Router();

router.get("/:id", VideoController.StreamVideo);

router.get("/", VideoController.PreviewVideos);

router.get("/:idVideo/videoInfo", VideoController.MetaVideo);

module.exports = router;
