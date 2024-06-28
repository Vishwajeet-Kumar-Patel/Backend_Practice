import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, /* Cross-origin resource sharing (CORS) is a browser mechanism which enables controlled access to resources located outside of a given domain. */ 
    credentials: true,
}))

app.use(express.json({limit: "16kb"})) /*for accepting data from json files with some limit */
app.use(express.urlencoded({extended: true, limit: "16kb"})) /* Used for encoding special charcters like space, @ etc. */
app.use(express.static("public")) /*public assets like images, pdfs, etc.*/

app.use(cookieParser()) /*for accepting cookies*/

export { app }


/* Middleware is software that different applications use to communicate with each other. It provides functionality to connect applications intelligently and efficiently so that you can innovate faster. */