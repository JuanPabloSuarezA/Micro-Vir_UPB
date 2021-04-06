const { Schema, model } = require("mongoose");

const videoSchema = new Schema({
  author: String,
  name: String,
  fileName: String,
  mimeType: String,
  originalName: String,
  duration: String,
  description: String,
  createdAt: { type: Date, default: Date.now() },
});

module.exports = model("Video", videoSchema);
