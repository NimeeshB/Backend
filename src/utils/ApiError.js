class ApiError extends Error { // express ut of the box gives you an Error class to handle errors gracefully which we can override 
    constructor(
        statusCode,
        message= "Something went wrong", // this is a generalized message, whoever will call this constructor will have to pass all these parameters 
        errors = [],
        stack = ""
    ){
        //override all these 
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}