// call all the required packages
const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cors = require('cors');

// errores
const enoent = require('./middlewares/enoent');
const eexist = require('./middlewares/eexist');
const err = require('./middlewares/err');

//Init
const app = express();
require('./db')

//Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img'),
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, uuidv4() + path.extname(file.originalname));
    }
})
app.use(multer({storage}).single('image'));


//Load Routes
const ImageRoutes = require('./routes/ImagenRoutes');
const contentRouter = require('./routes/content');
const uploadRouter = require('./routes/upload');
const downloadRouter = require('./routes/download');
const dirRouter = require('./routes/dir');

//Routes
app.use('/',ImageRoutes);
app.use('/content', contentRouter);
app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);
app.use('/dir', dirRouter);

// Errors
app.use(enoent);
app.use(eexist);
app.use(err);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));