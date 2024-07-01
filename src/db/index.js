import mongoose from "mongoose"; // Importing the mongoose library for MongoDB interactions
import { DB_NAME } from "../constants.js"; // Importing the database name from a constants file

// Defining an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Attempting to connect to the MongoDB database using mongoose
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`, // Constructing the MongoDB URI using environment variables and the database name
            {
                useNewUrlParser: true, // Using the new URL parser to handle connection strings
                useUnifiedTopology: true, // Enabling the unified topology layer for better server discovery and monitoring
            }
        );

        // Logging a success message to the console if the connection is successful
        console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (err) {
        // Logging an error message to the console if the connection fails
        console.log("MONGODB connection FAILED ", err);

        // Exiting the process with a failure code (1) if the connection fails
        process.exit(1);
    }
}

// Exporting the connectDB function as the default export from this module
export default connectDB;
