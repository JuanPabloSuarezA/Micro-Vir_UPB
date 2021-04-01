const express = require("express");

const VideoController = require("../controllers/video");
const Video = require("../models/Video");

const router = express.Router();

router.get("/", VideoController.PreviewVideos);

router.get("/:id", VideoController.StreamVideo);

router.get("/:idVideo/videoInfo", VideoController.MetaVideo);
router.post("/upload", VideoController.UploadVideo);
router.get("/:id/delete", VideoController.DeleteVideo);
module.exports = router;
