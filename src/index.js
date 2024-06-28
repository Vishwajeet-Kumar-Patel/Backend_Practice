// require('dotenv').config({path: './env'})

// Import the dotenv package to handle environment variables
import dotenv from 'dotenv';
// Import the connectDB function from the db directory to handle database connection
import connectDB from './db/index.js';

// Configure dotenv to load environment variables from the specified file
dotenv.config({
    path: './env'
});


// Attempt to connect to the database
connectDB()
    .then(() => {
        // If the connection is successful, start the server on the specified port or default to 8000
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT || 8000}`);
            
            // Add an event listener for server errors
            app.on('error', (error) => {
                console.error('ERROR', error);
                throw error;
            });
        });
    })
    .catch((err) => {
        // If the database connection fails, log an error message
        console.error('MongoDB connection failed !!!', err);
    });






/*
import express from "express";

const app = express()


( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`) 
        app.on("error", () => {
            console.log("ERROR", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()

*/