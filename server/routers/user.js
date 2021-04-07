const { Router } = require("express");
const jwt = require("jsonwebtoken");

const path = require("path");
const { unlink } = require("fs-extra");
const { imgFolder } = require("../public/img/path");
const appDir = require("../config");

const router = Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
  const token = req.body.Token;
  console.log(token);
  const { email } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.find({ email: email }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  });
  res.send(user);
});

router.post("/usersList", async (req, res) => {
  const token = req.body.Token;
  console.log(token);
  const { email } = jwt.verify(token, process.env.JWT_SECRET);
  const users = await User.find();
  res.send(users);
});

router.post("/delete", async (req, res) => {
  try {
    const id = req.body._id;
    const userDeleted = await User.findByIdAndDelete(id);
    res.send(true);
  } catch (e) {
    res.send(false);
  }
});
module.exports = router;
