const { Schema, model } = require("mongoose");

const videoSchema = new Schema({
  author: String,
  title: String,
  fileName: String,
  mimeType: String,
  originalName: String,
  duration: String,
  description: String,
  size: Number,
  createdAt: { type: Date, default: Date.now() },
  shared: [String],
});

module.exports = model("Video", videoSchema);
