const jwt = require("jsonwebtoken");

require('dotenv').config();


const JWT_secretKey = process.env.JWT_secretKey;

function auth(req,res,next){
    const token = req.headers.token;
    const decode = jwt.verify(token , JWT_secretKey);
    if(decode){
        req.userId = decode.id
        next()
    }
    else{
        res.json({
            message : "invalid credentials"
        });
    }
}

module.exports = {auth ,
    JWT_secretKey
};