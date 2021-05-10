"use strict"

var express = require("express");
var billController = require("../controllers/bill.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");

api.put("/addBill",mdAuth.ensureUser,billController.addBill);
api.get("/getBills",mdAuth.ensureUser,billController.getBills);
api.get("/getProductsBill/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],billController.getProductsBill);
api.get("/getMostProducts",mdAuth.ensureUser,billController.getMostProducts);

module.exports = api;