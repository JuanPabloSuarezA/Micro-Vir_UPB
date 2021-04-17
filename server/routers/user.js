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
  const user = jwt.verify(token, process.env.JWT_SECRET);
  const { email } = user;
  const usuario = await User.findOne({ email: email });
  // user.maxShare.push('3');
  console.log(usuario);
  res.send({ user: user, maxShare: usuario.maxShare, usuario });
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
