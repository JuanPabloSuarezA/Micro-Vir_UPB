const { Router } = require('express');

const path = require('path');
const { unlink } = require('fs-extra');
const {imgFolder} = require('../public/img/path')

//Inicializamos Router
const router = Router();

//Modelos
const Image = require('../models/Image')

router.get('/', async (req, res) => {
    const images = await Image.find();
    res.send(images)
})

router.get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    console.log(image)
    res.send(image);
});

router.get('/image/:id/delete', async (req, res) => {
    try {
        const { id } = req.params;
        const imageDeleted = await Image.findByIdAndDelete(id);
        await unlink(path.resolve(imgFolder + `/${imageDeleted.fileName}`));
        res.send(true)
    }catch (e) {
        res.send(false)
    }
    
    
});

router.post('/upload', ((req, res) => {
    try {
        const image = new Image();
        image.title = req.body.title;
        image.fileName = req.file.filename;
        image.path = "http://192.168.100.38:8080/" + req.file.filename;
        image.originalName = req.file.originalname;
        image.mimetype = req.file.mimetype;
        image.size = req.file.size;
        res.send(true)
        image.save();
    }catch (e) {
        res.send(false)
    }
    
}))

module.exports = router;