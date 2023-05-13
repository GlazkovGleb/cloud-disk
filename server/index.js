import express from "express";
import mongoose from "mongoose";
import config from "config"
import AuthRouter from "./routes/auth.routes.js";
import fileRouter from './routes/file.routes.js'
import cors from 'cors'
import fileUpload from "express-fileupload";

const app = express()
app.use(fileUpload({
    defCharset: 'utf8',
    defParamCharset: 'utf8'
}))
app.use(cors({
    origin: '*'
}))
app.use(express.json())
app.use(express.static('static'))
app.use('/auth', AuthRouter)
app.use('/files', fileRouter)

const PORT = config.get('serverPort')

const start = async () => {
    try {
        await mongoose.connect(config.get('DdUrl'))
        app.listen(PORT, () => console.log(`SERVER RUN ON PORT ${PORT}`))
    } catch(e) {
        console.log(e);
    }
}

start()