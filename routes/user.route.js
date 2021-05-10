"use strict"

var express = require("express");
var userController = require("../controllers/user.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");

api.post("/login",userController.login);
api.post("/register",userController.register);
api.put("/updateUser/:id",mdAuth.ensureUser,userController.updateUser);
api.delete("/removeUser/:id",mdAuth.ensureUser,userController.removeUser);

module.exports = api;