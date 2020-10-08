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
/*let users = [
  { id: 1, username: "test1", password: "a" },
  { id: 2, username: "test2", password: "b" },
];*/

// mongoose setup
mongoose.connect("mongodb://localhost:27017/pwa_local_database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  surname: String,
});
const User = mongoose.model("User", UserSchema);

/*const CollectionSchema = new mongoose.Schema({
  username: String,
  collection: String,
});*/
//const Collection = mongoose.model("Collection", CollectionSchema);

// TODO: collection in mongodb, routes returns

app.post("/auth/sign_in", (req, res) => {
  const { username, password } = req.body;

  User.find({ username: username }, function (err, data) {
    if (err) {
      res.sendStatus(500);
    }
    if (!!data && !!data[0]) {
      if (password === data[0].password) {
        // login correct, generate token
        // TODO: password is not hashed! (install bcrypt module)
        let token = jwtToken.sign(
          { username: data[0].username, password: data[0].password },
          "trakd_pwa_application",
          // TODO: set a good expiresIn
          { expiresIn: "60s", algorithm: "HS256" }
        );
        res.json({ username: data[0].username, token: token });
      } else {
        res.status(401).send("Wrong password");
      }
    } else {
      res.status(401).send("Login error");
    }
  });

  /*
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
  */
});

app.post("/auth/sign_up", (req, res) => {
  const { username, password, name, surname } = req.body;
  let element = new User({
    username: username,
    password: password,
    name: name,
    surname: surname,
  });

  User.find({ username: username }, function (err, data) {
    if (err) {
      res.sendStatus(500);
    }
    if (!!data && !!data[0]) {
      res.status(500).send("User already signed up");
    } else {
      element.save(function (err) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Pwa local server active!");
});

// get user collection
app.get("/collection", jwtMW, (req, res) => {
  // req.user è {username: 'test1', password: 'a'}
  console.log(req.user);
  res.send("collection get");
});

// save user collection
app.post("/collection", jwtMW, (req, res) => {
  // req.user è {username: 'test1', password: 'a'}
  res.send("collection save");
});

// get user profile data
app.get("/profile", jwtMW, (req, res) => {
  // req.user è {username: 'test1', password: 'a'}
  res.send("profile get");
});

// save user profile data
app.post("/profile", jwtMW, (req, res) => {
  // req.user è {username: 'test1', password: 'a'}
  res.send("profile save");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
