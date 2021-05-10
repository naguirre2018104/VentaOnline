"use strict"

var jwt = require("jwt-simple");
var moment = require("moment");
var secretKey = "IN6AM";

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        password: user.password,
        role: user.role,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(10,"minutes").unix()
    }
    return jwt.encode(payload,secretKey);
}