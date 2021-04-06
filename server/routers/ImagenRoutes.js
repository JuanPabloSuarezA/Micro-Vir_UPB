﻿const { Router } = require("express");
const jwt = require("jsonwebtoken");

const path = require("path");
const { unlink } = require("fs-extra");
const { imgFolder } = require("../public/img/path");
const appDir = require("../config");

//Inicializamos Router
const router = Router();

//Modelos
const Image = require("../models/Image");

//Home
router.post("/", async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.verify(token, process.env.JWT_SECRET);
  const images = await Image.find({ author: email }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  });
  res.send(images);
});

//Info image
router.get("/image/:id", async (req, res) => {
  const { id } = req.params;
  const image = await Image.findById(id);

  console.log("Server diego{");
  console.log(image);
  console.log("Server diego}");
  res.send(image);
});

router.get("/images/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  res.sendFile(`/public/img/${id}`, {
    root: appDir,
  });
});

//Delete image
router.get("/image/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const imageDeleted = await Image.findByIdAndDelete(id);
    await unlink(path.resolve(imgFolder + `/${imageDeleted.fileName}`));
    res.send(true);
  } catch (e) {
    res.send(false);
  }
});

//Upload Image
router.post("/upload", (req, res) => {
  if (req.body.tipo === "upload") {
    const token = req.body.Token;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    try {
      const image = new Image();
      image.author = email.toLowerCase();
      image.title = req.body.title;
      image.fileName = req.file.filename;
      image.path = "http://192.168.100.38:8080/" + req.file.filename;
      image.originalName = req.file.originalname;
      image.mimetype = req.file.mimetype;
      image.size = req.file.size;
      res.send(true);
      image.save();
    } catch (e) {
      res.send(false);
    }
  } else {
    const token = req.body.Token;
    const { userName } = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ userName });
  }
});

module.exports = router;
