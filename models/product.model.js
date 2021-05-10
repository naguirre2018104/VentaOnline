"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = ({
    name: String,
    price: Number,
    stock: Number
})

module.exports = mongoose.model("product",productSchema);