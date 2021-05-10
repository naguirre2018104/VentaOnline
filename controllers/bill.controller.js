"use strict"

var Bill = require("../models/bill.model");
var User = require("../models/user.model");
var Cart = require("../models/cart.model");
var Product = require("../models/product.model");

function addBill(req,res){
    var userId = req.user.sub;

    Cart.findOne({owner: userId},(err,cartFind)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar su carrito"});
        }else if(cartFind){
            if(cartFind.products != ""){
                let cantidad = cartFind.stock;
                let producto = cartFind.products;
                let i = 0;
                let j = 0;
                producto.forEach(element =>{
                    Product.findOne({_id:element},(err,productFind)=>{
                        if(err){
                            res.status(500).send({message: "Error al buscar producto"})
                        }else if(productFind){
                            let stockP = productFind.stock;
                            if(stockP<cantidad[i]){
                                i++;
                                return res.send({message: "Cantidad de carrito (stock) ahora no es válida"});
                            }else{
                                i++;
                            }
                        }else{
                        res.status(403).send({message: "No se encontró el producto"});
                        }
                    })
                })
                producto.forEach(element =>{
                    Product.findOne({_id:element},(err,productFind)=>{
                        if(err){
                            res.status(500).send({message: "Error al buscar producto"})
                        }else if(productFind){
                            let stockP = productFind.stock;
                            let stockT = stockP - cantidad[j];
                            j++;
                            Product.findByIdAndUpdate(element,{stock:stockT},{new:true},(err,stockUpdated)=>{
                                if(err){
                                    res.status(500).send({message: "Error al actualizar stock"});
                                }else if(stockUpdated){
                                    console.log("El stock del producto se actualizó exitosamente");
                                }else{
                                    res.status(500).send({message: "No se actualizó"});
                                }
                            })
                        }else{
                        res.status(403).send({message: "No se encontró el producto"});
                        }
                    })
                })
                var bill = new Bill();
                bill.name = req.user.name;
                bill.products = producto;
                bill.save((err,billSaved)=>{
                    if(err){
                        return res.status(500).send({message: "Error al guardar factura"});
                    }else if(billSaved){
                        User.findByIdAndUpdate(userId,{$push:{bills:billSaved._id}},{new:true},(err,userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: "Error al conectar factura con usuario"});
                            }else if(userUpdated){
                                Cart.findOneAndRemove({owner: userId},(err,cartRemoved)=>{
                                    if(err){
                                        return res.status(500).send({message: "Error al eliminar carrito"});
                                    }else if(cartRemoved){
                                        var cart = new Cart();
                                        cart.owner = req.user.sub;
                                        cart.save((err,cartSaved)=>{
                                            if(err){
                                                return res.status(500).send({message: "Error al limpiar carrito"});
                                            }else if(cartSaved){
                                                return res.send({message: "Carrito listo para otra compra",billSaved});
                                            }else{
                                                return res.status(404).send({message: "No se limpió el carrito"});
                                            }
                                        })
                                    }else{
                                        return res.status(404).send({message: "Carrito no existente"});
                                    }
                                })
                            }else{
                                return res.status(404).send({message: "No se conectó la factura con el usuario"});
                            }
                        })
                    }else{
                        return res.status(404).send({message: "Factura no creada"});
                    }
                })
            }else{
                return res.status(403).send({message: "No tiene productos en su carrito"});
            }
        }else{
            return res.status(403).send({message: "No se encontró su carrito"});
        }
    })
}

function getBills(req,res){
    var userId = req.user.sub;

    if(req.user.role == "ROLE_ADMIN"){
        Bill.find({}).exec((err,bills)=>{
            if(err){
                return res.status(500).send({message: "Error al obtener facturas"});
            }else if(bills){
                return res.send({message: "Todas las facturas: ",bills});
            }else{
                return res.status(403).send({message: "No hay facturas por mostrar"});
            }
        })
    }else{
        User.findOne({_id : userId}).populate("bills").exec((err,user)=>{
            if(err){
                console.log(err);
                return res.status(500).send({message: "Error al obtener datos"});
            }else if(user){
                var facturas = user.bills;
                return res.send({message: "Facturas: ",facturas});
            }else{
                return res.status(403).send({message: "No hay registros"});
            }
        })
    }
}

function getProductsBill(req,res){
    var billId = req.params.id;

    Bill.findById({_id:billId}).populate("products").exec((err,billFind)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar factura"});
        }else if(billFind){
            var productos = billFind.products;
            return res.send({message: "Los productos de la factura son: ",productos});
        }else{
            return res.status(403).send({message: "ID de factura inexistente"});
        }
    })
}

function getMostProducts(req,res){
    Bill.find({}).populate("products").exec((err,bills)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar productos"});
        }else if(bills){
            let productos = [];
            bills.forEach(element => {
                if(productos.includes(element.products)){
                    //No hace nada
                }else{
                    productos.push(element.products);
                }
            });
            return res.send({message: "Los productos más vendidos: ",productos});
        }else{
            return res.status(403).send({message: "No hay productos por mostrar"});
        }
    })
}

module.exports = {
    addBill,
    getBills,
    getProductsBill,
    getMostProducts
}