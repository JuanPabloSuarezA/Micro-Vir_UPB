const {Schema, model} = require('mongoose');

const imageSchema= new Schema({
    author: String,
    title: String,
    fileName: String,
    path: String,
    originalName: String,
    mimeType: String,
    size:  Number,
    createdAt: {type: Date, default: Date.now()}
})

module.exports = model('Image', imageSchema)