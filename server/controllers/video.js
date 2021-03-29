const fs = require("fs");

//Modelo para videos
const videos = [
  {
    id: 0,
    duration: "< 1 min",
    name: "Juan",
  },
  {
    id: 1,
    duration: "< 1 min",
    name: "Diego",
  },
  {
    id: 2,
    duration: "< 1 min",
    name: "Mark",
  },
];

// Se envia la info de todos los videos al frontend para su previsualizacion
// app.get("/videos", (req, res) => res.json(videos));
function PreviewVideos(req, res) {
  res.json(videos);
}

// Se envia la info de un video especifico a partir de
//  su ID indicado en los parametros con :
function MetaVideo(req, res) {
  const id = parseInt(req.params.idVideo, 10);
  res.json(videos[id]);
}

/***************************************************************************************
 *    Title: Video Streaming Application
 *    Author: Rathore, D
 *    Date: Wednesday, October 7, 2020
 *    Code version: 0.1
 *    Availability: https://www.linode.com/docs/guides/build-react-video-streaming-app/
 *
 ***************************************************************************************/

//Método para enviar chunks o trozos de video en vez de servir el video completo

function StreamVideo(req, res) {
  //Se genera la ruta para obtener el video en base al id enviado
  // que indica su nombre
  const path = `assets/${req.params.id}.mp4`;
  //Se obtiene el estado del video actual
  const stat = fs.statSync(path);

  //Se obtiene el peso del video actual en bytes
  const fileSize = stat.size;

  //Se recibe el parametro range enviado por el navegador
  // para determinar cual trozo de video enviar
  const range = req.headers.range;

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
}

module.exports = {
  StreamVideo,
  PreviewVideos,
  MetaVideo,
};
