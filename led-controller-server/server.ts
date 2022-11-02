import express from 'express';
import ws from 'ws';
import router from './router';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT ?? 5000

app.use(express.json());
app.listen(port, ()=>{
    console.log(`App listening on port ${port}`)
});
app.use('/', router)

const DB_URI = process.env.DB_URI ?? "";
mongoose.connect(DB_URI).catch(
    error => console.error("Failed to connect to MongoDB.", error)
);

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

