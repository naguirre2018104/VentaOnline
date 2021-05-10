"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = Schema ({
    name: String,
    lastname: String,
    username: String,
    password: String,
    role: String,
    email: String,
    bills: [{type: Schema.ObjectId, ref:"bill"}]
})

module.exports = mongoose.model("user",userSchema);