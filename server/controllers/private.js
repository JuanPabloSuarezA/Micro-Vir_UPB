
exports.getPrivateData = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: "Accediste a private data" 
    })
}