"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var billSchema = ({
    name: String,
    products: [{type: Schema.ObjectId, ref:"product"}]
})

module.exports = mongoose.model("bill",billSchema);