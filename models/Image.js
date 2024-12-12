const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "Image url is required"],
  },
  prompt: {
    type: String,
    required: [true, "Image prompt is required"],
  },
});

const Images = mongoose.model("Images", ImageSchema);

module.exports = Images;
