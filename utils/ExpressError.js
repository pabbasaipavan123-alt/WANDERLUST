class ExpressError extends Error {
    constructor(statusCode = 500, message = "Something Went Wrong"){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;