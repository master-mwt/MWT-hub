const express = require("express");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const bodyParser = require("body-parser");
const jwtToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// jwt middleware
const jwtMW = jwt({ secret: "trakd_pwa_application", algorithms: ["HS256"] });

// set cors headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send(err);
  } else {
    next(err);
  }
});

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
const UserCollectionSchema = new mongoose.Schema({
  username: String,
  userCollection: String,
});
const UserCollection = mongoose.model("UserCollection", UserCollectionSchema);

// routes
app.post("/auth/sign_in", (req, res) => {
  const { username, password } = req.body;

  User.find({ username: username }, function (err, data) {
    if (err) {
      res.sendStatus(500);
    }
    if (!!data && !!data[0]) {
      if (bcrypt.compareSync(password, data[0].password)) {
        // login correct, generate token
        let token = jwtToken.sign(
          { username: data[0].username, password: data[0].password },
          "trakd_pwa_application",
          { expiresIn: "2h", algorithm: "HS256" }
        );
        res.json({ username: data[0].username, token: token });
      } else {
        res.status(401).send("Wrong password");
      }
    } else {
      res.status(401).send("Login error");
    }
  });
});

app.post("/auth/sign_up", (req, res) => {
  const { username, password, name, surname } = req.body;
  let hashedPassword = bcrypt.hashSync(password, 10);
  let element = new User({
    username: username,
    password: hashedPassword,
    name: name,
    surname: surname,
  });
  let collection = new UserCollection({
    username: username,
    userCollection: JSON.stringify({}),
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
          collection.save(function (err) {
            if (err) {
              res.sendStatus(500);
            } else {
              res.json({
                username: username,
                name: name,
                surname: surname,
              });
            }
          });
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
  const { username } = req.user;
  UserCollection.find({ username: username }, function (err, data) {
    if (err) {
      res.sendStatus(500);
    }
    if (!!data && !!data[0]) {
      res.json(JSON.parse(data[0].userCollection));
    } else {
      res.status(500).send("No collection found");
    }
  });
});

// save user collection
app.post("/collection", jwtMW, (req, res) => {
  // req.user è {username: 'test1', password: 'a'}
  const { username } = req.user;

  let element = new UserCollection({
    username: username,
    userCollection: JSON.stringify(req.body),
  });

  UserCollection.find({ username: username }, function (err, data) {
    if (err) {
      res.sendStatus(500);
    }
    if (!!data && !!data[0]) {
      UserCollection.update(
        { username: username },
        { userCollection: JSON.stringify(req.body) },
        { multi: false },
        (err) => {
          if (err) {
            res.sendStatus(500);
          } else {
            res.json(req.body);
          }
        }
      );
    } else {
      element.save(function (err, collection) {
        if (err) {
          res.sendStatus(500);
        } else {
          res.json(req.body);
        }
      });
    }
  });
});

// get user profile data
app.get("/profile", jwtMW, (req, res) => {
  // req.user è {username: 'test1', password: 'a'}
  const { username } = req.user;
  User.find({ username: username }, function (err, data) {
    if (err) {
      res.sendStatus(500);
    }
    if (!!data && !!data[0]) {
      res.json({
        username: data[0].username,
        name: data[0].name,
        surname: data[0].surname,
      });
    } else {
      res.status(500).send("No user data");
    }
  });
});

// save user profile data
app.post("/profile", jwtMW, (req, res) => {
  // req.user è {username: 'test1', password: 'a'}
  const { username } = req.user;
  User.find({ username: username }, function (err, data) {
    if (err) {
      res.sendStatus(500);
    }
    if (!!data && !!data[0]) {
      User.update(
        { username: username },
        {
          name: req.body.name,
          surname: req.body.surname,
        },
        { multi: false },
        (err) => {
          if (err) {
            res.sendStatus(500);
          } else {
            res.json({
              username: username,
              name: req.body.name,
              surname: req.body.surname,
            });
          }
        }
      );
    } else {
      res.status(500).send("User not found");
    }
  });
});

// server starts listening on chosen port
// ctrl+c to stop
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
