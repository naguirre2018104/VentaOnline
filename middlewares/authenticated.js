"use strict"

var jwt = require("jwt-simple");
var moment = require("moment");
var secretKey = "IN6AM";

exports.ensureUser = (req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: "La cabecera no lleva token"});
    }else{
        var token = req.headers.authorization.replace(/['"']+/g,"");
        try{
            var payload = jwt.decode(token,secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: "El token ha expirado"});
            }
        }catch(err){
            return res.status(404).send({message: "El token no es válido o ya expiró"});
        }
    }
    req.user = payload;
    console.log(req.user);
    next();
}

exports.ensureAdmin = (req,res,next)=>{
    var payload = req.user;
    if(payload.role != "ROLE_ADMIN"){
        return res.status(401).send({message: "Solo los administradores tienen acceso"});
    }else{
        return next();
    }
}