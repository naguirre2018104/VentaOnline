"use strict"

var express = require("express");
var categoryController = require("../controllers/category.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");

api.post("/createCategory",[mdAuth.ensureUser,mdAuth.ensureAdmin],categoryController.createCategory);
api.put("/updateCategory/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],categoryController.updateCategory);
api.delete("/removeCategory/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],categoryController.removeCategory);
api.get("/getCategories",mdAuth.ensureUser,categoryController.getCategories);
api.get("/searchCategory",mdAuth.ensureUser,categoryController.searchCategory);

module.exports = api;