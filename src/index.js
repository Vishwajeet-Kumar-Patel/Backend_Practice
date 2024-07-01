// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import app from './app.js'; // Import the app instance from app.js

// Configure dotenv to load environment variables from the specified file
dotenv.config({
    path: './.env'
});

// Attempt to connect to the database
connectDB()
    .then(() => {
        // If the connection is successful, start the server on the specified port or default to 8000
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running at port: ${port}`);
        });
    })
    .catch((err) => {
        // If the database connection fails, log an error message
        console.error('MongoDB connection failed !!', err);
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