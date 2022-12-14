import express from 'express';
import { RawData, WebSocketServer } from 'ws';
import router from './router';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Renderer, { FRAMES_PER_SECOND } from './renderer';
dotenv.config();

const app = express();
const port = process.env.PORT ?? 5000

app.use(express.json());
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
app.use('/api', router)

const DB_URI = process.env.DB_URI ?? "";
mongoose.connect(DB_URI).catch(
    error => console.error("Failed to connect to MongoDB.", error)
);

const db = mongoose.connection
db.on('error', console.error.bind(console, "MongoDB connection error:"))


// Websocket
export const renderer = new Renderer();
const wsServer = new WebSocketServer({ port: 8080 });

wsServer.on('connection', (ws) => {
    ws.on('message', async function message(data: RawData) {
        //The only message we should ever receive from the client is their display ID
        let displayId = data.toString();

        //Send one second of frames
        for(let i = 0; i < FRAMES_PER_SECOND; i++){
            renderer.getNextFrame(displayId).then((result) => ws.send(result));
        }
    })
});
