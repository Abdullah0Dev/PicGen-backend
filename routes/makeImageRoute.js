const express = require("express");
const { generateImage } = require("../controllers/makeImageController");

const router = express.Router();

router.post("/generate-image", generateImage);

module.exports = router;
