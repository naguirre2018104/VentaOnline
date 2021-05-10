"use strict"

var express = require("express");
var bodyParser = require("body-parser");
var userRoutes = require("./routes/user.route");
var categoryRoutes = require("./routes/category.route");
var productRoutes = require("./routes/product.route");
var cartRoutes = require("./routes/cart.route");
var billRoutes = require("./routes/bill.route");

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use("/v1",userRoutes);
app.use("/v1",categoryRoutes);
app.use("/v1",productRoutes);
app.use("/v1",cartRoutes);
app.use("/v1",billRoutes);

module.exports = app;