"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cartSchema = ({
    compra: Boolean,
    owner: {type: Schema.ObjectId, ref:"user"},
    products: [{type: Schema.ObjectId, ref:"product"}],
    stock: [Number]
})

module.exports = mongoose.model("cart",cartSchema);