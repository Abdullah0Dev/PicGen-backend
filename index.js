require("dotenv").config();
const express = require("express");
const makeImageRoute = require("./routes/makeImageRoute");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
// middlewares
app.use(express.json());
// middleware to log API requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/images", express.static(path.join(__dirname, "public", "images")));

// routes
app.get("/", (req, res) => res.send("Hello from API"));
const PORT = 4000;
app.use("/api/", makeImageRoute);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(
    // run the app
    app.listen(PORT, () => {
      console.log("The Server is Running on Port 4000");
    })
  )
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
