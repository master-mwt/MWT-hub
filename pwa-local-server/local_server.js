const express = require("express");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const bodyParser = require("body-parser");
const jwtToken = require("jsonwebtoken");

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// jwt middleware
const jwtMW = jwt({ secret: "trakd_pwa_application", algorithms: ["HS256"] });

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send(err);
  } else {
    next(err);
  }
});

// this data should be in db
let users = [
  { id: 1, username: "test1", password: "a" },
  { id: 2, username: "test2", password: "b" },
];

// TODO: mongodb setting, routes returns, registration?

app.post("/auth/sign_in", (req, res) => {
  const { username, password } = req.body;
  // this should be a query in db
  for (let user of users) {
    // passwords should be hashed
    if (username === user.username && password === user.password) {
      // login correct, generate token
      let token = jwtToken.sign(
        { username: user.username, password: user.password },
        "trakd_pwa_application",
        // TODO: set a good expiresIn
        { expiresIn: "60s", algorithm: "HS256" }
      );
      res.json({ username: username, token: token });
    }
  }
  res.status(401).send("Login error");
});

app.get("/", (req, res) => {
  res.send("Pwa local server active!");
});

// get user collection
app.get("/collection", jwtMW, (req, res) => {
  res.send("collection get");
});

// save user collection
app.post("/collection", jwtMW, (req, res) => {
  res.send("collection save");
});

// get user profile data
app.get("/profile", jwtMW, (req, res) => {
  res.send("profile get");
});

// save user profile data
app.post("/profile", jwtMW, (req, res) => {
  res.send("profile save");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
