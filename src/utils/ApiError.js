class ApiError extends Error {
    constructor(
        statusCode,             // HTTP status code representing the error
        message = "something went wrong", // Default error message
        errors = [],            // Array to hold additional error details
        stack = ""              // Optional stack trace
    ) {
        super(message);         // Call the parent class (Error) constructor with the message
        this.statusCode = statusCode; // Assign the status code
        this.data = null;       // Initialize data property to null
        this.message = message; // Assign the error message
        this.success = false;   // Indicates the failure status
        this.errors = errors;   // Assign additional error details

        // Capture the stack trace if provided, otherwise capture the current stack trace
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor); 
            /* Error.captureStackTrace creates a .stack property on the error instance which includes the point in the code at which Error.captureStackTrace was called.
               This is useful for custom error handling to maintain the correct stack trace. */
        }
    }
}

// Export the ApiError class so it can be used in other modules
export { ApiError };
