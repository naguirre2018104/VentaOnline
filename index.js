"use strict"

var mongoose = require("mongoose");
var app = require("./app");
var port = 3200;
var admin = require("./controllers/user.controller");
var deafultCategory = require("./controllers/category.controller");

mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify",false);
mongoose.connect("mongodb://localhost:27017/DBVentaOnline",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("Conectado a la base de datos");
    admin.admin();
    deafultCategory.deafultCategory();
    app.listen(port,()=>{
        console.log("Servidor EXPRESS en funcionamiento");
    })
})
.catch((err)=>{
    console.log("Error",err);
})