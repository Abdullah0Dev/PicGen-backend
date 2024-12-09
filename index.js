const express = require("express");
const makeImageRoute = require("./routes/makeImageRoute");
const app = express();

// middlewares
app.use(express.json());
// middleware to log API requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// routes
app.get("/", (req, res) => res.send("Hello from API"));

app.use("/api/", makeImageRoute);
// run the app
app.listen(4000, () => {
  console.log("The Server is Running on Port 4000");
}); 