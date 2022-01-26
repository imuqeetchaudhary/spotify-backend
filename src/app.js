const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const allRoutes = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enable...");
}

app.use("/", allRoutes);

app.get("/", (req, res) => res.json({ message: "Online Shop RESTful API" }));

app.use((req, res) => {
  const error = new Error("Route not found");
  error.status = 404;
  res.status(error.status || 500).json({ error: error.message });
});

module.exports = { app };
