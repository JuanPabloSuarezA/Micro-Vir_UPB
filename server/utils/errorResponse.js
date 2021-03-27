class ErrorResponse extends Error {
    constructor(message, stastusCode){
        super(message);
        this.stastusCode = stastusCode;
    }
}

module.exports = ErrorResponse;