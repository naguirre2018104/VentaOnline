"use strict"

var express = require("express");
var productController = require("../controllers/product.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");

api.put("/setProduct/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],productController.setProduct);
api.put("/:idC/updateProduct/:idP",[mdAuth.ensureUser,mdAuth.ensureAdmin],productController.updateProduct);
api.put("/:idC/removeProduct/:idP",[mdAuth.ensureUser,mdAuth.ensureAdmin],productController.removeProduct);
api.get("/getProducts",mdAuth.ensureUser,productController.getProducts);
api.get("/searchProduct",mdAuth.ensureUser,productController.searchProduct);
api.get("/spentProducts",mdAuth.ensureUser,productController.spentProducts);

module.exports = api;