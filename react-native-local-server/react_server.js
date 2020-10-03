const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 8080;

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/react_native", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const UserCollectionSchema = new mongoose.Schema({
  email: String,
  userCollection: String,
});
const UserCollection = mongoose.model("UserCollection", UserCollectionSchema);

app.get("/", (req, res) => {
  res.send("React native local server active!");
});

app.post("/collection", (req, res) => {
  let element = new UserCollection({
    email: req.body.email,
    userCollection: JSON.stringify(req.body.collection),
  });

  UserCollection.find({ email: `${req.body.email}` }, function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (!!data && !!data[0]) {
      UserCollection.update(
        { email: `${req.body.email}` },
        { userCollection: JSON.stringify(req.body.collection) },
        { multi: false },
        (err) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        }
      );
    } else {
      element.save(function (err, collection) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

app.get("/collection", (req, res) => {
  UserCollection.find({ email: `${req.query.email}` }, function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (!!data && !!data[0]) {
      res.send(data[0].userCollection);
    } else {
      res.sendStatus(500);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
