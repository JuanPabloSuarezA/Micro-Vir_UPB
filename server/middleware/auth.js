const jwt = require('jsonwebtoken');
const  User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse')

exports.protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token){
        return next(new ErrorResponse("No está autorizado para acceder a esta ruta.", 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user){
            return next(new ErrorResponse("Ningun usuario encontrado con ese id", 404))
        }
        
        req.user = user;
        
        next();
    }catch (e) {
        return next(new ErrorResponse("No autorizado"), 401)
    }
}