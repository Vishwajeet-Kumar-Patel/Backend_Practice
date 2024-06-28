class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if(stack) {
            this.stack = stack 
        } else {
            Error.captureStackTrace(this, this.constructor) /* To capture the location where a decorator function is applied, we can use the `Error. captureStackTrace` method. This method allows us to create a custom error object and capture the call stack information of the current code execution. */
        }
     
    }
}

export { ApiError }