const express = require('express');
const connectDB = require('./config/db');
const env = require('dotenv').config()
const cors = require("cors");


const app = express()
const port = process.env.PORT || 5001;
connectDB();

app.use(cors({
    origin: process.env.APPLICATION_URL, // your Next.js frontend
    credentials: true
}));
app.use(express.json()) //which is to read json object if user pass payload
app.use('/api/auth', require('./routes/auth'))

app.listen(port, ()=>{
    console.log("Your project is running on this port : ", port);
})


