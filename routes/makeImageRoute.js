const express = require("express");
const { generateImage, fetchAllRecentImages } = require("../controllers/makeImageController");

const router = express.Router();

router.post("/generate-image", generateImage);
router.get("/recent-images", fetchAllRecentImages);

module.exports = router;
