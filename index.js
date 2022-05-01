const express = require("express");
require("dotenv").config();
const cors = require("cors");
var MongoClient = require("mongodb").MongoClient;
const app = express();

const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
// username: admin
// password: 6iA57hoatUuBpTKZ

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node server is running");
});

app.listen(port, () => {
  console.log("Node server is running");
});
