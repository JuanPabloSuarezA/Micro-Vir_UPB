// call all the required packages
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const appDir = require("./config");

const cors = require("cors");
require("dotenv").config({ path: "./.env" });

const Image = require("./models/Image");

//Init
const app = express();
app.use(express.json());
require("./config/db");

//Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/img"),
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});
app.use(multer({ storage }).single("image"));

//Load Routes
const ImageRoutes = require("./routers/ImagenRoutes");
const userRouter = require("./routers/user");
const authRouter = require("./routers/authRoutes");
const videoRouter = require("./routers/video");
// const PrivateRoutes = require("./routes/privateRoutes");

//Routes
app.use("/", ImageRoutes);
app.use("/auth", authRouter);
app.use("/videos", videoRouter);
app.use("/profile", userRouter);
// app.use("/private", PrivateRoutes);

const PORT = process.env.PORT || 4000;
const IP_SERVER = "localhost";

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
