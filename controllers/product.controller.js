"use strict"

var Product = require("../models/product.model");
var Category = require("../models/category.model");

function setProduct(req,res){
    var categoryId = req.params.id;
    var params = req.body;

    if(params.name && params.price && params.stock){
        Category.findById(categoryId,(err,categoryFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(categoryFind){
                Product.findOne({name: params.name},(err,productFind)=>{
                    if(err){
                        return res.status(500).send({message: "Error al buscar producto"});
                    }else if(productFind){
                        return res.send({message: "Producto ya existente"});
                    }else{
                        var product = new Product();
                        product.name = params.name;
                        product.price = params.price;
                        product.stock = params.stock;
                        product.save((err,productSaved)=>{
                            if(err){
                                return res.status(500).send({message: "Error al agregar"});
                            }else if(productSaved){
                                Category.findByIdAndUpdate(categoryId,{$push:{products:productSaved._id}},{new: true},(err,categoryUpdated)=>{
                                    if(err){
                                        return res.status(500).send({message: "Error al agregar producto a categoría"});
                                    }else if(categoryUpdated){
                                        return res.send({message: "Producto agregado a la categoría exitosamente",categoryUpdated});
                                    }else{
                                        return res.status(404).send({message: "No se agregó el producto a categoría"});
                                    }
                                })
                            }else{
                                return res.status(404).send({message: "No se guardó"});
                            }
                        })
                    }
                })
            }else{
                return res.status(403).send({message: "Categoría inexistente"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos (Nombre, precio y cantidad)"});
    }
}

function updateProduct(req,res){
    let categoryId = req.params.idC;
    let productId = req.params.idP;
    let update = req.body;

    if(update.stock){
        Product.findById(productId,(err,productFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar producto"});
            }else if(productFind){
                Category.findOne({_id:categoryId,products:productId},(err,categoryFind)=>{
                    if(err){
                        return res.status(500).send({message: "Error al buscar categoría"});
                    }else if(categoryFind){
                        Product.findByIdAndUpdate(productId,update,{new:true},(err,productUpdated)=>{
                            if(err){
                                return res.status(500).send({message: "Error al actualizar producto"});
                            }else if(productUpdated){
                                return res.send({message: "Producto actualizado exitosamente",productUpdated});
                            }else{
                                return res.status(404).send({message: "No se actualizó"});
                            }
                        })
                    }else{
                        return res.status(403).send({message: "ID de categoría inexistente"});
                    }
                })
            }else{
                return res.status(403).send({message: "ID de producto no existente"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos (cantidad)"});
    }
}

function removeProduct(req,res){
    let categoryId = req.params.idC;
    let productId = req.params.idP;

    Category.findOneAndUpdate({_id:categoryId,products:productId},{$pull:{products:productId}},{new:true},(err,categoryUpdated)=>{
        if(err){
            return res.status(500).send({message: "Error al eliminar de categoría"});
        }else if(categoryUpdated){
            Product.findByIdAndRemove(productId,(err,productRemoved)=>{
                if(err){
                    return res.status(500).send({message: "Error al eliminar producto"});
                }else if(productRemoved){
                    return res.send({message: "Producto eliminado exitosamente"});
                }else{
                    return res.status(403).send({message: "No se eliminó"});
                }
            })
        }else{
            return res.status(404).send({message: "Producto inexistente o ya fue eliminado"});
        }
    })
}

function getProducts(req,res){
    Product.find({}).exec((err,productos)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar"});
        }else if(productos){
            return res.send({message: "Productos: ",productos});
        }else{
            return res.status(403).send({message: "No se encontraron productos"});
        }
    })
}

function searchProduct(req,res){
    var params = req.body;

    if(params.search){
        Product.find({name: params.search},(err,resultSearch)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar coincidencias"});
            }else if(resultSearch){
                return res.send({message: "Coincidencias encontradas: ",resultSearch});
            }else{
                return res.status(403).send({message: "No se encontraron coincidencias"});
            }
        })
    }else if(params.search == ""){
        Product.find({}).exec((err,productos)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(productos){
                return res.send({message: "Productos: ",productos});
            }else{
                return res.status(403).send({message: "No se encontraron productos"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese el campo de búsqueda (search)"});
    }
}

function spentProducts(req,res){
    Product.find({stock: 0},(err,resultSearch)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar productos agotados"});
        }else if(resultSearch){
            if(resultSearch != ""){
                return res.send({message: "Productos agotados: ",resultSearch});
            }else{
                return res.status(404).send({message: "No se encontraron productos agotados"});
            }
        }else{
            return res.status(404).send({message: "No se encontraron productos agotados"});
        }
    })
}

module.exports = {
    setProduct,
    updateProduct,
    removeProduct,
    getProducts,
    searchProduct,
    spentProducts
}