// Import the necessary modules
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Create an instance of Express
const app = express();

// Use CORS middleware for enabling Cross-Origin Resource Sharing
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allows requests from specified origin
    credentials: true, // Allows credentials such as cookies, authorization headers, or TLS client certificates to be sent
}));

// Use middleware to parse JSON bodies, with a size limit of 16kb
app.use(express.json({ limit: '16kb' }));

// Use middleware to parse URL-encoded bodies, with a size limit of 16kb
app.use(express.urlencoded({ extended: true, limit: '1000000' }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Use middleware to parse cookies
app.use(cookieParser());

// Routes import and declaration
import userRoutes from './routes/user.routes.js';
app.use('/api/v2/users', userRoutes); // Mount userRoutes under /api/v2/users

// http://localhost:3000/api/v2/users/register

// Export the configured Express app instance
export default app;




/* Middleware is software that different applications use to communicate with each other. It provides functionality to connect applications intelligently and efficiently so that you can innovate faster. */