const { Router } = require("express");
const jwt = require("jsonwebtoken");

const path = require("path");
const { unlink } = require("fs-extra");
const { imgFolder } = require("../public/img/path");
const appDir = require("../config");

const router = Router();
const User = require("../models/User");

//Send user data
router.get("/", async (req, res) => {
  const { Token } = req.query;
  const user = jwt.verify(Token, process.env.JWT_SECRET);
  const { email } = user;
  const usuario = await User.findOne({ email: email });
  // user.maxShare.push('3');

  res.send({ user: user, maxShare: usuario.maxShare, usuario });
});

//Update user profile
router.get("/updateProfile", async (req, res) => {
  try {
    const { userName, firstName, lastName, birthDate, Token } = req.query;
    const { email } = jwt.verify(Token, process.env.JWT_SECRET);
    await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          userName: userName,
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate,
        },
      }
    );
    res.send(true);
  } catch (e) {
    res.send(false);
  }
});

//Update user by admin
router.get("/updateUser", async (req, res) => {
  try {
    const { email, access, diskQuota } = req.query;
    await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          email: email,
          access: access,
          diskQuota: diskQuota,
        },
      }
    );
    res.send(true);
  } catch (e) {
    res.send(false);
  }
});

//Send all users
router.get("/usersList", async (req, res) => {
  const { Token } = req.query;
  const user = jwt.verify(Token, process.env.JWT_SECRET);
  const { email } = user;
  const users = await User.find();
  res.send(users);
});

//Delete one user
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
