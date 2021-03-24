// call all the required packages
const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');



//Init
const app = express();
require('./db')

//Middleware
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
const ImageRoutes = require('./routers/ImagenRoutes')

//Routes
app.use('/',ImageRoutes);

const PORT = 4000;

app.listen(PORT, () => console.log(`Server start on port ${PORT}`));