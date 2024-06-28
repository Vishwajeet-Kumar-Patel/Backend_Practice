class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // HTTP status code for the response
        this.data = data;             // Data to be included in the response
        this.message = message;       // Response message, default is "Success"
        this.success = statusCode < 400; // Boolean indicating success or failure based on status code
    }
}

// Export the ApiResponse class so it can be used in other modules
export { ApiResponse };


/* HTTP response status codes indicate whether a specific HTTP request has been successfully completed. Responses are grouped in five classes:

1. Informational responses (100 – 199)
2. Successful responses (200 – 299)
3. Redirection messages (300 – 399)
4. Client error responses (400 – 499)
5. Server error responses (500 – 599) */