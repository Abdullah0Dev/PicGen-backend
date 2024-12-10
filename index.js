const express = require("express");
const makeImageRoute = require("./routes/makeImageRoute");
const app = express();
const path = require("path"); 

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

app.use("/api/", makeImageRoute);
// run the app
app.listen(4000, () => {
  console.log("The Server is Running on Port 4000");
}); 