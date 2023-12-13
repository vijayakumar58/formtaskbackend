const express = require('express');
const app = express();
const cors = require('cors');
const mongodb = require ('mongodb');
const mongoClient = mongodb.MongoClient;
const dotenv = require ('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const URL = process.env.DB;
const DB = "formdemo"

app.listen(process.env.PORT || 3000);

//middleware 
app.use(express.json());
app.use(cors({
    origin : "*"
}))

//Home page
app.get('/',function(req,res){
    res.send("Welcome to Form Demo Application")
})

//Create User
app.post('/createuser', async function(req,res){
    try {
        const connection = await mongoClient.connect(URL)
        const db = connection.db(DB);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password,salt);
        req.body.password = hash;
        req.body.confirmpassword = hash;
        await db.collection('users').insertOne(req.body);
        await connection.close();
        res.json({message:"User Data Insert"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Something went wrong"})
    }
})

//Get All Users
app.get('/getusers', async function (req, res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        const users = await db.collection('users').find().toArray();
        await connection.close();
        res.json(users)
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
    }
})

//view User
app.get('/viewuser/:id', async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        const view = await db.collection('users').findOne({_id: new mongodb.ObjectId(req.params.id)});
        await connection.close();
        res.json(view);
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
    }
})