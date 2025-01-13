const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel, TodoModel } = require("./db");
const app = express();
const { auth, JWT_secretKey } = require("./auth");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {z} = require("zod");

require('dotenv').config();

app.use(express.json());
mongoose.connect(process.env.MONGO_URI);

app.post("/signup", async function (req, res) {
const schema = z.object({
    email: z.string().min(3).max(100).email(),
    username: z.string().min(3).max(100),
    password: z.string().min(8).max(50)
    .refine((pass) => /[A-Z]/.test(pass),{
        message: "Password must contain atleast one uppercase letter",
    })
    .refine((pass) => /[a-z]/.test(pass),{
        message: "Password must contain atleast one lowercase letter",
    })
    .refine((pass) => /[0-9]/.test(pass),{
        message: "Password must contain atleast one numeric character",
    })
    .refine((pass) => /[!@#$%^&*~`?<>]/.test(pass),{
        message: "Password must contain atleast one special character"
    })
})
const parseData = schema.safeParse(req.body);
if(!parseData.success){
    res.json({
        message: "Invalid data",
        error:  parseData.error.issues[0].message,
             
    })
    return;
}


try{
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password,10)

    await UserModel.create({
        email: email,
        username: username,
        password: hashedPassword
    })


    res.json({
        message: "You are signed up !!!"
    })
}catch(e){
    console.log(e)
    res.status(500).json({
        message : "Something went wrong"
    })
}
});

app.post("/signin", async function (req, res) {
    try{
    const email = req.body.email;
    const password = req.body.password;
    // console.log("Email:", email);
    // console.log("Password:", password);
    const user = await UserModel.findOne({
        email: email,
       
    })
    const validPassword = await bcrypt.compare(password , user.password);

    if (validPassword) {
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_secretKey);
        res.json({
            token : token
        })
    }
    else {
        res.status(403).json({
            message: "Invalid Credentials"
        })
    }
}catch(e){
    console.log(e)
    res.status(500).json({
        message : "Something went wrong"
    })
}
});

app.get("/todo",auth, async function (req, res) {
    const title = req.body.title;
    const userId = req.body.userId;
    await TodoModel.create({
        title,
        userId
    })
    res.json({
        user_Id : userId
    })
});

app.get("/todos", auth , async function(req, res) {
    const userId = req.userId;
    const todos = await TodoModel.findOne({
        userId : userId
    })
    res.json({
        user_Id : userId
    })

});



app.listen(3000);