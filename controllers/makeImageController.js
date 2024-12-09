require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
const fs = require("node:fs"); // For handling file paths if you're sending an image file
const Images = require("../models/Image");

const generateImage = async (req, res) => {
  const { prompt, aspect_ratio, negative_prompt, api_key } = req.body;
  console.log(prompt, aspect_ratio, negative_prompt, api_key);

  try {
    const payload = {
      prompt,
      output_format: "webp",
      aspect_ratio, // 16:9 1:1 21:9 2:3 3:2 4:5 5:4 9:16 9:21
      negative_prompt,
    };
    const FINAL_STABILITY_API_KEY = api_key || process.env.STABILITY_API_KEY;
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${FINAL_STABILITY_API_KEY}`,
          Accept: "image/*",
        },
      }
    );

    if (response.status === 200) {
      // Define file path
      const fileName = `generated_${Date.now()}.webp`;
      const publicDir = path.join(__dirname, "..", "public", "images");

      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      console.log(publicDir, response);
      const filePath = path.join(publicDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(response.data));

      const imageUrl = `https://picgen-pro-maker.onrender.com/images/${fileName}`;
      console.log(`Image URL: `, imageUrl);

      const newImage = await Images.create({
        prompt: prompt,
        url: imageUrl,
      });

      await newImage.save();
      res.status(200).json({ imageUrl });
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error("Error generating image:", error);
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    }
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

const fetchAllRecentImages = async (req, res) => {
  try {
    const recentImages = await Images.find({});
    if (!recentImages) {
      return res.status(404).json({ message: "no recent message found" });
    }
    res.status(200).json(recentImages);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server internal error" });
  }
};

module.exports = { generateImage, fetchAllRecentImages };
