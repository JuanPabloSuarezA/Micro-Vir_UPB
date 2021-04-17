const fs = require("fs");

const Video = require("../models/Video");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const path = require("path");
const { unlink } = require("fs-extra");
const { imgFolder } = require("../public/img/path");
const appDir = require("../config");

const { getVideoDurationInSeconds } = require("get-video-duration");

// Se envia la info de todos los videos al frontend para su previsualizacion
const PreviewVideos = async (req, res, next) => {
  try {
    const token = req.body.token;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    console.log(email);
    const videos = await Video.find({ author: email }, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    });
    res.json(videos);
  } catch (err) {
    console.log(err);
    next();
  }
};
// Se envia la info de un video especifico a partir de
//  su ID indicado en los parametros con :
const MetaVideo = async (req, res, next) => {
  try {
    const id = req.params.idVideo;
    const video = await Video.findById(id);
    res.json(video);
  } catch (err) {
    console.log(err);
    next();
  }
};

//Upload Videos
const UploadVideo = async (req, res) => {
  if (req.body.tipo === "upload") {
    const token = req.body.Token;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const videoSize = req.file.size * (9.31 * 10 ** -10);
    const { maxShare } = await User.findOne({ email: email });
    const newSize = maxShare - videoSize;
    if (newSize < 0) {
      res.send(false);
    } else {
      try {
        console.log(newSize);
        const video = new Video();
        video.author = email.toLowerCase();
        video.name = req.body.title;
        video.description = req.body.description;
        video.fileName = req.file.filename;
        video.originalName = req.file.originalname;
        video.mimetype = req.file.mimetype;
        video.size = videoSize;
        getVideoDurationInSeconds(`public/img/${video.fileName}`).then(
          async (duration) => {
            var date = new Date(0);
            date.setSeconds(duration);
            var timeStr = date.toISOString().substr(11, 8);
            console.log(timeStr);
            video.duration = timeStr;
            res.send(true);
            await User.findOneAndUpdate(
              { email: email },
              {
                $set: {
                  maxShare: newSize,
                },
              }
            );
            await video.save();
          }
        );
      } catch (e) {
        res.send(false);
      }
    }
  } else {
    const token = req.body.Token;
    const { userName } = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ userName });
  }
};
//Delete video
const DeleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { Token, sizeVideo } = req.query;
    const { email } = jwt.verify(Token, process.env.JWT_SECRET);
    const { maxShare } = await User.findOne({ email: email });
    // const videoSize = sizeVideo;
    const newSize = Number(maxShare) + Number(sizeVideo);
    await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          maxShare: newSize,
        },
      }
    );
    const videoDeleted = await Video.findByIdAndDelete(id);

    await unlink(path.resolve(imgFolder + `/${videoDeleted.fileName}`));
    res.send(true);
  } catch (e) {
    res.send(false);
  }
};

//Actualizar videos

const UpdateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, Token, fileName } = req.query;
    const { email } = jwt.verify(Token, process.env.JWT_SECRET);
    await Video.findOneAndUpdate(
      { fileName: fileName },
      {
        $set: {
          name: title,
          description: description,
        },
      }
    );
    res.send(true);
  } catch (e) {
    res.send(false);
  }
};
/***************************************************************************************
 *    Title: Video Streaming Application
 *    Author: Rathore, D
 *    Date: Wednesday, October 7, 2020
 *    Code version: 0.1
 *    Availability: https://www.linode.com/docs/guides/build-react-video-streaming-app/
 *
 ***************************************************************************************/

//Método para enviar chunks o trozos de video en vez de servir el video completo

const StreamVideo = async (req, res, next) => {
  //Se genera la ruta para obtener el video en base al id enviado
  // que indica su nombre
  const video = await Video.findById(req.params.id);
  const path = `public/img/${video.fileName}`;
  //Se obtiene el estado del video actual
  const stat = fs.statSync(path);

  //Se obtiene el peso del video actual en bytes
  const fileSize = stat.size;

  //Se recibe el parametro range enviado por el navegador
  // para determinar cual trozo de video enviar
  const range = req.headers.range;

  console.log(range);

  // Como no todos los navegadores envian el parametro range
  // se manejan los que no lo envian en el bloque else
  if (range) {
    // Se extraen las partes de inicio y fin indicados en la cabecera
    // recibida que se encuentran separados por "-"
    const parts = range.replace(/bytes=/, "").split("-");

    //Se obtiene el valor de la parte inicial desde donde comenzará
    // el chunk o trozo de video que se enviará
    const start = parseInt(parts[0], 10);

    //Se obtiene el valor de la parte final del chunk o trozo de video
    // si existe, si no se asume que es el tamaño total del video - 1
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    //Se calcula el tamaño total del trozo al restar el final por el inicio
    const chunksize = end - start + 1;

    //Se envia en el encabezado de respuesta el rango del contenido con
    // los bytes de inicio, fin y tamaño de archivo, se notifica la aceptacion
    // de solitudes parciales con accept-ranges, se envia el tamaño del chunk
    // o trozo y se envia el tipo de contenido que es el video
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    // Se envia un encabezado de respuesta con
    // status 206 (ok para contenido parcial)
    // y la info  del tipo de video y su respectivo tamaño
    res.writeHead(206, head);

    //createReadStream nos permite leer el contenido del archivo en el path
    // indicado leyendo los trozos del video secuencialmente pedazo a pedazo,
    // con pipe se toma el "Readable stream" y se enlaza a la referencia del
    // archivo o video abierto (open file descriptor) para servirlo en
    // el navegador
    fs.createReadStream(path, { start, end }).pipe(res);
  } else {
    //Para los navegadores que no envían range
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    // Se envia un encabezado de respuesta con status 200 (ok) y la info
    // del tipo de video y su respectivo tamaño
    res.writeHead(200, head);

    //Documentado en el bloque IF anterior, no hay inicio ni fin por falta
    // del parametro range
    fs.createReadStream(path).pipe(res);
  }
};

module.exports = {
  StreamVideo,
  PreviewVideos,
  MetaVideo,
  UploadVideo,
  DeleteVideo,
  UpdateVideo,
};
