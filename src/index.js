import express from "express";
import path from "path";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Promise from 'bluebird';

import auth from "./routes/auth";
import users from "./routes/users";
import books from "./routes/books";

dotenv.config();


const app = express();

app.use(bodyParser.json());

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser: true,  useCreateIndex: true,});

// app.post("/api/auth",(req,res)=>{
//     res.status(400).json({errors:{global:"invalid credentials"}});
// });

app.use("/api/auth",auth);
app.use("/api/users",users);
app.use("/api/books",books);

app.get("/*", (req,res) =>{
    res.sendFile(path.join(__dirname,"index.html"));
});

app.listen(8080,() =>console.log("server running on port 8080"));