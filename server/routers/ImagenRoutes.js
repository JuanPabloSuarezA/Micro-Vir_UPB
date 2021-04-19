﻿const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
  //Subidas
  const token = req.body.token;
  const { email } = jwt.verify(token, process.env.JWT_SECRET);
  /* const images = await Image.find({ author: email }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  }); */
  //Shared
  const imagesShared = await Image.find(
    { shared: email },
    function (err, result) {
      if (err) {
        console.log(err);
        /*  res. send ( err ) ; */
      } else {
        console.log(result);
        /* res. json( resultado ) ; */
      }
    }
  );
  console.log(imagesShared);
  /* const allImages = Object.assign(images, imagesShared); */
  res.send(imagesShared);
});

//Info image
router.get("/image/:id", async (req, res) => {
  const { id } = req.params;
  const image = await Image.findById(id);
  res.send(image);
});

router.get("/images/:id", (req, res) => {
  const id = req.params.id;
  res.sendFile(`/public/img/${id}`, {
    root: appDir,
  });
});

//Delete image
router.get("/image/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    //Extraigo los params
    const { imageSize, Token } = req.query;
    //Decodifico el token para obtener el email y saber qué usuario está logeado
    const { email } = jwt.verify(Token, process.env.JWT_SECRET);
    //Hago una consulta a mongo para saber el maxShare actual de dicho usuario
    const { maxShare } = await User.findOne({ email: email });
    //Ahora opero los tamaños para hallar el nuevo al borrar la imagen
    const newSize = Number(maxShare) + Number(imageSize);
    //Se hace una consulta a mongo y actualizamos la cuota máxima (maxShare)
    await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          maxShare: newSize,
        },
      }
    );
    const imageDeleted = await Image.findByIdAndDelete(id);
    await unlink(path.resolve(imgFolder + `/${imageDeleted.fileName}`));
    res.send(true);
  } catch (e) {
    res.send(false);
  }
});

//Delete imagen compartida
router.get("/image/:id/delete-shared", async (req, res) => {
  try {
    const { id } = req.params;
    //Extraigo los params
    const { Token } = req.query;
    //Decodifico el token para obtener el email y saber qué usuario está logeado
    const { email } = jwt.verify(Token, process.env.JWT_SECRET);
    await Image.findOneAndUpdate(
      { _id: id },
      {
        $pull: {
          shared: email,
        },
      }
    );
    res.send(true);
  } catch (e) {
    console.log(e);
  }
});
//Update image
router.get("/image/:id/update", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, Token, fileName } = req.query;
    const { email } = jwt.verify(Token, process.env.JWT_SECRET);
    await Image.findOneAndUpdate(
      { fileName: fileName },
      {
        $set: {
          title: title,
          description: description,
        },
      }
    );
    res.send(true);
  } catch (e) {
    res.send(false);
  }
});

//Upload Image
router.post("/upload", async (req, res) => {
  if (req.body.tipo === "upload") {
    const token = req.body.Token;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const imageSize = req.file.size * (9.31 * 10 ** -10);
    const { maxShare } = await User.findOne({ email: email });
    const newSize = maxShare - imageSize;
    if (newSize < 0) {
      res.send(false);
    } else {
      try {
        const image = new Image();
        image.author = email.toLowerCase();
        image.title = req.body.title;
        image.description = req.body.description;
        image.fileName = req.file.filename;
        image.path = "http://192.168.100.38:8080/" + req.file.filename;
        image.originalName = req.file.originalname;
        image.mimetype = req.file.mimetype;
        image.size = imageSize;
        image.shared = [email.toLowerCase()];
        await image.save();
        await User.findOneAndUpdate(
          { email: email },
          {
            $set: {
              maxShare: newSize,
            },
          }
        );
        res.send(true);
      } catch (e) {
        console.log(e);
        res.send(false);
      }
    }
  } else {
    const token = req.body.Token;
    const { userName } = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ userName });
  }
});

//Compartir imagen con otros usuarios
router.post("/shared", async (req, res) => {
  const { params } = req.body;
  const { email, id } = params;
  const userValidate = await User.findOne({ email: email });
  console.log(userValidate);
  if (userValidate) {
    Image.updateOne(
      { _id: id },
      {
        $addToSet: {
          shared: [email],
        },
      },
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );
    res.send(true);
  } else {
    res.send(false);
    console.log("Usuario no encontrado");
  }
});

module.exports = router;
