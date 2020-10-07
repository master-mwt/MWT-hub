const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 8080;

// TODO: jwt setting, mongodb setting, routes returns

app.get("/", (req, res) => {
  res.send("Pwa local server active!");
});

// get user collection
app.get("/collection", (req, res) => {
  res.send("collection get");
});

// save user collection
app.post("/collection", (req, res) => {
  res.send("collection save");
});

// get user profile data
app.get("/profile", (req, res) => {
  res.send("profile get");
});

// save user profile data
app.post("/profile", (req, res) => {
  res.send("profile save");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
