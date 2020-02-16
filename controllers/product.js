const axios = require('axios')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Category = require("../Models/Category");
const Make = require("../Models/Makes");
const User = require("../Models/User");
const Product = require("../Models/Product");
const Message = require("../Models/Message");

const Variant = require("../Models/Variant");
const cloudinary = require('cloudinary');
require('../handler/cloudinary');
const upload = require('../handler/multer');
const fetch = require('node-fetch');

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if(entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}
function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if(!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}
function removeEntity(res) {
    return function(entity) {
        if(entity) {
            return entity.remove()
                .then(() => {
                    res.status(204).end();
                });
        }
    };
}

exports.createProduct =  async (req, res, next) => {
    // console.log(req.body.images)


   // console.log('eq.bodyeq.bodyeq.bodyeq.body',req.body.images[0][0]) // bar
    let images=[]
    let metadata = {}

   // console.log("create product")


    for(let i=0;i<req.body.images.length;i++){
        const result = await cloudinary.v2.uploader.upload(req.body.images[i]);
        images.push(result.secure_url)
    }


   // console.log("req.bodyreq.bodyreq.bodyreq.body", req.body)
    if (req.body.category === null || req.body.category === "Uncatgorized") {


        const product = new Product({
            name: req.body.name,
            active: req.body.active,
            description: req.body.description,
            address: req.body.address,
            price: req.body.price,
            phone: req.body.phone,
            images: images,
            category: null,
            created_at: new Date(),
            type: req.body.type,
            //metaData:metadata,
            user: req.body.user,
            url: "https://" + req.body.url,

            location: {"lat": req.body.coordinate.lat, "lon": req.body.coordinate.lon},
            devise:req.body.devise,

        });

        product.save()
            .then(product => {
               // console.log("create product")
                res.status(200).json({
                    success: true,
                    message: "product created successfully!",
                    result: product
                });
            }).catch(handleError(res));

    }
    else {
        Category.findById(req.body.category).then(category => {

            if (req.body.BodyType) {
                metadata = {
                    BodyType: req.body.BodyType,
                    Color: req.body.Color,
                    NumberDoors: req.body.NumberofDoors,
                    NumberSeats: req.body.NumberofSeats,
                    Transmission: req.body.Transmission,
                    Make: req.body.Make,
                    Modele: req.body.Model,
                    FuelType: req.body.FuelType,
                    ForSaleBy: req.body.ForSaleBy,
                    Kilometers: req.body.Kilometers,
                    year: req.body.Year,

                }
            }

           // console.log("categorycategory", category)

            const productt = new Product({
                name: req.body.name,
                active: req.body.active,
                description: req.body.description,
                address: req.body.address,
                price: req.body.price,
                phone: req.body.phone,
                images: images,
                category: category,
                created_at: new Date(),
                type: req.body.type,
                metaData: metadata,
                user: req.body.user,

                location: {"lat": req.body.coordinate.lat, "lon": req.body.coordinate.lon},
                devise:req.body.devise,
                cats:req.body.cats

            });
            //console.log("productproductproductproduct", productt)

            productt.save()
                .then(product => {

                    console.log("create product")

                    /*  Category.findById(category._id).then(categoryToUpdate=>{

                          categoryToUpdate.quantity ++;

                          categoryToUpdate.save();

                      })
  */
                    res.status(200).json({
                        success: true,
                        message: "product created successfully!",
                        result: product
                    });
                }).catch(handleError(res));

        })

    }










};



exports.UpdateProduct = (req, res, next) => {
    let catt;
    let metadata ={}
    Product.findById(req.body._id).then(product=>{
       // console.log('update body',req.body.category)
        if(req.body.category._id){
            product.name = req.body.name;
            product.description = req.body.description;
            product.address = req.body.address;
            product.phone = req.body.phone;
            product.type = req.body.type;
            product.url = req.body.url;
            product.category = req.body.category;
            if(req.body.BodyType){
                metadata = {
                    BodyType: req.body.BodyType,
                    Color: req.body.Color,
                    NumberDoors: req.body.NumberDoors,
                    NumberSeats: req.body.NumberSeats,
                    Transmission: req.body.Transmission,
                    Make: req.body.Make,
                    Modele: req.body.Modele,
                    FuelType: req.body.FuelType,
                    ForSaleBy: req.body.ForSaleBy,
                    Kilometers: req.body.Kilometers,
                    year: req.body.year,

                }
                product.metaData = metadata;
            }
            product.save().then(handleEntityNotFound(res))
                .then(respondWithResult(res))
                .catch(handleError(res));
        }else if(req.body.category ==="Uncatgorized"){
            console.log('update body')
            Category.findById(req.body.category).then(category=> {
                product.name = req.body.name;
                product.description = req.body.description;
                product.address = req.body.address;
                product.phone = req.body.phone;
                product.type = req.body.type;
                product.url = req.body.url;
                product.category = null;
                product.metaData =null;
                product.save().then(handleEntityNotFound(res))
                    .then(respondWithResult(res))
                    .catch(handleError(res));
            })

        }else{
            Category.findById(req.body.category).then(category=> {

                product.name = req.body.name;
                product.description = req.body.description;
                product.address = req.body.address;
                product.phone = req.body.phone;
                product.type = req.body.type;
                product.url = req.body.url;
                product.category = category;
                if(req.body.BodyType){
                    metadata = {
                        BodyType: req.body.BodyType,
                        Color: req.body.Color,
                        NumberDoors: req.body.NumberDoors,
                        NumberSeats: req.body.NumberSeats,
                        Transmission: req.body.Transmission,
                        Make: req.body.Make,
                        Modele: req.body.Modele,
                        FuelType: req.body.FuelType,
                        ForSaleBy: req.body.ForSaleBy,
                        Kilometers: req.body.Kilometers,
                        year: req.body.year,

                    }
                    product.metaData = metadata;
                }
                product.save().then(handleEntityNotFound(res))
                    .then(respondWithResult(res))
                    .catch(handleError(res));
            })

        }


    })


    /* Category.findById(req.body.undefined).then(category=>{

         return Product.findOneAndUpdate({_id: req.body._id},{$set: {name: req.body.name, descriptionFr: req.body.descriptionFr, descriptionEn: req.body.descriptionEn, descriptionAr: req.body.descriptionAr, images:req.body.images, price:req.body.price, category: category,}}, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

             .then(handleEntityNotFound(res))
             .then(respondWithResult(res))
             .catch(handleError(res));


     })*/

};

exports.activeProduct =async (req, res, next) => {

    Product.findOneAndUpdate({_id:req.params.id},{ "active": true },{new: true} )
        .then(entity => {
            if(entity.category !==null  && entity.category !==undefined){
                for(let i=0;i<entity.cats.length;i++){
                    if(entity.cats[i] !== null || entity.cats[i] !== undefined ){

                        Category.findById(entity.cats[i]).then(categoryToUpdate=>{
                            categoryToUpdate.quantity ++;
                            categoryToUpdate.save().then(test=>{
                                //  console.log(test)
                            })
                            //console.log("categoryToUpdate",JSON.stringify(categoryToUpdate))
                            if(entity.cats[i] === entity.category._id ){
                                Product.findOneAndUpdate({_id:entity._id},{ "category": categoryToUpdate },{new: true} ).exec()
                                categoryToUpdate.quantity ++;
                                categoryToUpdate.save()
                                    .then(ent => {
                                        console.log("entententent",JSON.stringify(ent))


                                        ent.on('es-indexed', (err, result) => {


                                        });
                                    })
                            }




                        })
                    }
                }


                /* Category.findById(entity.category._id).then(categoryToUpdate=>{
                     console.log(" entity.category",categoryToUpdate)
                             categoryToUpdate.quantity ++;
                             categoryToUpdate.save();
                             //console.log("categoryToUpdate",JSON.stringify(categoryToUpdate))
                             Product.findOneAndUpdate({_id:entity._id},{ "category": categoryToUpdate },{new: true} ).exec()
                                 .then(ent => {
                                     //console.log("entententent",JSON.stringify(ent))

                                     ent.on('es-indexed', (err, result) => {


                                     });
                                 })



                 })*/
            }
            Product.find()
                .exec()
                .then(respondWithResult(res))
                .catch(handleError(res));


        })
};






exports.getSponsoredProducts = (req, res, next) => {

    return Product.find( { $and: [ {type:"sponsored"}, { active: true } ] } )
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));

};

exports.getDailyProducts = (req, res, next) => {

    //return Product.find({type:"Daily Deals"})

    return Product.find( { $and: [ {type:"Daily Deals"}, { active: true } ] } )
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));

};
exports.UpdateProduct = (req, res, next) => {

    console.log('req.params.id',req.body._id)
    Category.findById(req.body.undefined).then(category=>{

        return Product.findOneAndUpdate({_id: req.body._id},{$set: {name: req.body.name, descriptionFr: req.body.descriptionFr, descriptionEn: req.body.descriptionEn, descriptionAr: req.body.descriptionAr, images:req.body.images, price:req.body.price, category: category,}}, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()


            .then(handleEntityNotFound(res))
            .then(respondWithResult(res))
            .catch(handleError(res));


    })

};

exports.getProducts = (req, res, next) => {

    return Product.find()
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));

};
exports.getProductByUserId = (req, res, next) => {
    console.log('req.body',req.body)
    return Product.find({"user._id":req.body.id})
        .exec()
        .then((product)=>{
            console.log("productproductproduct",product)
            res.status(200).json({
                message: "Products fetched successfully!",
                result: product
            });


        })
        .catch(handleError(res));

};
exports.getProductById = (req, res, next) => {
    console.log('req.body',req.body)
    return Product.findById(req.body.productId)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));

};

exports.getProductByIdFront = (req, res, next) => {
    console.log('req.body',req.body)
    return Product.findById(req.body.productId)
        .exec()
        .then(result=>{
            res.status(200).json({
                success:true,
                message: "Products fetched successfully!",
                product: result
            });
        })
        .catch(handleError(res));

};


exports.getProductByCategory = (req, res, next) => {
    console.log('req.body',req.body)
    return Product.find({ $and: [ {"category._id": req.body.id}, { active: true } ] }).sort({_id:-1})

        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));

};

exports.deleteProductById = (req, res, next) => {
    console.log('id',req.params.id)

    return Product.findById(req.params.id).exec()
        .then(entity => {
            if(entity.category !=null){

                if(entity.active){
                    for(let i=0;i<entity.cats.length;i++){
                        if(entity.cats[i] !== null){
                            Category.findById(entity.cats[i]).then(categoryToUpdate=>{
                                // console.log(" categoryToUpdate1", categoryToUpdate.quantity)
                                categoryToUpdate.quantity --;
                                categoryToUpdate.save().then(test=>{
                                    // console.log(test)
                                    // console.log(" categoryToUpdate2", test.quantity)
                                })
                                //console.log("categoryToUpdate",JSON.stringify(categoryToUpdate))

                            })
                        }
                    }
                    fetch('http://nappdeal.com:9200/products/_doc/' + entity._id, {


                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'

                        }

                    })

                        .then((response) => response.json())
                        .then(response => {

                            console.log("response",response)
                        })
                }



            }
            entity.remove()
                .then(result =>{
                    Product.find({_id: {$ne: req.params.id}})
                        .exec()
                        .then(respondWithResult(res))

                })
                .catch(handleError(res));


        })


};
exports.deleteProduct= (req, res, next) => {

    return Product.findById(req.body.id).exec()
        .then(entity => {
            if(entity.category !=null){
                if(entity.active){
                    for(let i=0;i<entity.cats.length;i++){
                        if(entity.cats[i] !== null){
                            Category.findById(entity.cats[i]).then(categoryToUpdate=>{
                               // console.log(" categoryToUpdate1", categoryToUpdate.quantity)
                                categoryToUpdate.quantity --;
                                categoryToUpdate.save().then(test=>{
                                    // console.log(test)
                                   // console.log(" categoryToUpdate2", test.quantity)
                                })
                                //console.log("categoryToUpdate",JSON.stringify(categoryToUpdate))

                            })
                        }
                    }
                    fetch('http://nappdeal.com:9200/products/_doc/' + entity._id, {


                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'

                        }

                    }) .then((response) => response.json())
                        .then(response => {

                            //console.log("response",response)
                        })

                }

            }
            entity.remove()
                .then(result =>{

                    Product.find({"user._id":req.body.user})
                        .exec()
                        .then((product)=>{
                           // console.log("productproductproduct",product.length)
                            res.status(200).json({
                                message: "Products fetched successfully!",
                                result: product
                            });

                        })
                })
                .catch(handleError(res));

        })







};
/*
exports.deleteProduct= (req, res, next) => {
    console.log('id',req.body)

    return Product.findById(req.body.id).exec()
        .then(entity => {
            // console.log("entity.category._identity.category._identity.category._id",entity.category._id)
            if(entity.category !=null){


                Category.findById(entity.category._id).then(categoryToUpdate=>{

                    // categoryToUpdate.quantity --;

                    //categoryToUpdate.save();

                })
            }
            entity.remove()
                .then(result =>{
                    fetch('http://nappdeal.com:9200/products/_doc/' + result._id, {


                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'

                        }

                    })

                        .then((response) => response.json())
                        .then(response => {

                            //console.log("response",response)
                        })
                    Product.find({"user._id":req.body.user})
                        .exec()
                        .then((product)=>{
                          //  console.log("productproductproduct",product)
                            res.status(200).json({
                                message: "Products fetched successfully!",
                                result: product
                            });


                        })
                })
                .catch(handleError(res));
        })






};
*/



/*
exports.activeProduct =async (req, res, next) => {
    Product.findOneAndUpdate({_id:req.params.id},{ "active": true },{new: true} )
        .then(entity => {
            console.log("entity.catsentity.catsentity.cats",entity.cats)
            if(entity.category !=null){
                for(let i=0;i<entity.cats.length;i++){
                    if(entity.cats[i] !== null || entity.cats[i] !== undefined ){
                        Category.findById(entity.cats[i]).then(categoryToUpdate=>{
                            categoryToUpdate.quantity ++;
                            categoryToUpdate.save().then(test=>{
                                //  console.log(test)
                            })
                            //console.log("categoryToUpdate",JSON.stringify(categoryToUpdate))
                            if(entity.cats[i] === entity.category._id ){
                                Product.findOneAndUpdate({_id:entity._id},{ "category": categoryToUpdate },{new: true} ).exec()
                                categoryToUpdate.quantity ++;
                                categoryToUpdate.save()
                                    .then(ent => {
                                        console.log("entententent",JSON.stringify(ent))
                                        ent.on('es-indexed', (err, result) => {
                                        });
                                    })
                            }
                        })
                    }
                }
                /!* Category.findById(entity.category._id).then(categoryToUpdate=>{
                     console.log(" entity.category",categoryToUpdate)
                             categoryToUpdate.quantity ++;
                             categoryToUpdate.save();
                             //console.log("categoryToUpdate",JSON.stringify(categoryToUpdate))
                             Product.findOneAndUpdate({_id:entity._id},{ "category": categoryToUpdate },{new: true} ).exec()
                                 .then(ent => {
                                     //console.log("entententent",JSON.stringify(ent))
                                     ent.on('es-indexed', (err, result) => {
                                     });
                                 })
                 })*!/
            }
            Product.find()
                .exec()
                .then(respondWithResult(res))
                .catch(handleError(res));
        })
};
*/
exports.activeProduct =async (req, res, next) => {
    Product.findOneAndUpdate({_id:req.params.id},{ "active": true },{new: true} )
        .then(entity => {
            if(entity.category !=null){
                for(let i=0;i<entity.cats.length;i++){
                    if(entity.cats[i] !== null){
                        Category.findById(entity.cats[i]).then(categoryToUpdate=>{
                            categoryToUpdate.quantity ++;
                            categoryToUpdate.save().then(test=>{
                                //  console.log(test)
                            })
                            //console.log("categoryToUpdate",JSON.stringify(categoryToUpdate))
                            if(entity.cats[i] === entity.category._id ){
                                Product.findOneAndUpdate({_id:entity._id},{ "category": categoryToUpdate },{new: true} ).exec()
                                categoryToUpdate.quantity ++;
                                categoryToUpdate.save()
                                    .then(ent => {
                                        console.log("entententent",JSON.stringify(ent))
                                        ent.on('es-indexed', (err, result) => {
                                        });
                                    })
                            }
                        })
                    }
                }
                /* Category.findById(entity.category._id).then(categoryToUpdate=>{
                     console.log(" entity.category",categoryToUpdate)
                             categoryToUpdate.quantity ++;
                             categoryToUpdate.save();
                             //console.log("categoryToUpdate",JSON.stringify(categoryToUpdate))
                             Product.findOneAndUpdate({_id:entity._id},{ "category": categoryToUpdate },{new: true} ).exec()
                                 .then(ent => {
                                     //console.log("entententent",JSON.stringify(ent))
                                     ent.on('es-indexed', (err, result) => {
                                     });
                                 })
                 })*/
            }
            Product.find()
                .exec()
                .then(respondWithResult(res))
                .catch(handleError(res));
        })
};

exports.disactiveProduct = (req, res, next) => {
    Product.findOneAndUpdate({_id: req.params.id}, {"active": false}, {new: true}).exec()
        .then(entity => {
            console.log("entity.catsentity.catsentity.cats",entity.cats)

            if(entity.category !=null){
                for(let i=0;i<entity.cats.length;i++){
                    if(entity.cats[i] !== null){
                        Category.findById(entity.cats[i]).then(categoryToUpdate=>{
                            categoryToUpdate.quantity --;
                            categoryToUpdate.save().then(test=>{
                                // console.log(test)
                            })
                            //console.log("categoryToUpdate",JSON.stringify(categoryToUpdate))
                            if(entity.cats[i] === entity.category._id ){
                                Product.findOneAndUpdate({_id:entity._id},{ "category": categoryToUpdate },{new: true} ).exec()
                                categoryToUpdate.quantity --;
                                categoryToUpdate.save()
                                    .then(ent => {
                                        fetch('http://nappdeal.com:9200/products/_doc/' + entity._id, {
                                            method: 'DELETE',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            }
                                        })
                                            .then((response) => response.json())
                                            .then(response => {
                                                console.log("entity.Delete",JSON.stringify(categoryToUpdate))
                                            })
                                    })
                            }
                        })
                    }
                }
                /* Category.findById(entity.category._id).then(categoryToUpdate=>{
                     console.log(" entity.category",categoryToUpdate)
                             categoryToUpdate.quantity ++;
                             categoryToUpdate.save();
                             //console.log("categoryToUpdate",JSON.stringify(categoryToUpdate))
                             Product.findOneAndUpdate({_id:entity._id},{ "category": categoryToUpdate },{new: true} ).exec()
                                 .then(ent => {
                                     //console.log("entententent",JSON.stringify(ent))
                                     ent.on('es-indexed', (err, result) => {
                                     });
                                 })
                 })*/
            }
            //
            /*
                        if(entity.category !=null) {
                                Category.findById(entity.category._id).then(categoryToUpdate=>{
                                        categoryToUpdate.quantity--;
                                        categoryToUpdate.save();
                                        Product.findOneAndUpdate({_id: entity._id}, {"category": categoryToUpdate}, {new: true}).exec()
                                            .then(ent => {
                                                fetch('http://nappdeal.com:9200/products/_doc/' + entity._id, {
                                                    method: 'DELETE',
                                                    headers: {
                                                        'Accept': 'application/json',
                                                        'Content-Type': 'application/json'
                                                    }
                                                })
                                                    .then((response) => response.json())
                                                    .then(response => {
                                                      //  console.log("response", response)
                                                    })
                                            })
                                })
                    }
            */
            Product.find()
                .exec()
                .then(respondWithResult(res))
                .catch(handleError(res))
            /**/
        })
};


exports.UpdateProductFront = (req, res, next) => {
    console.log('req.params.id',req.body.id)
    return Product.findOneAndUpdate({_id: req.body.id},{$set: {name: req.body.name, description:req.body.description,price:req.body.price,active:false}}, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(result=>{
            console.log("result",result)
            res.status(200).json({
                success:true,
                //message: "product created successfully!",
                result: result
            });
        })
        .catch(handleError(res));
};
exports.UpdateProductView = (req, res, next) => {
    console.log('req.params.id',req.body.id)
    return Product.findById(req.body.id).exec()
        .then(result=>{
            result.viewed +=1;
            result.save().then(data=>{
                res.status(200).json({
                    success:true,
                    message: "data",
                    result: result
                });
            })
        })
        .catch(handleError(res));
};
exports.getFreeProducts = (req, res, next) => {
    return Product.find( { $and: [ {type:"Featured"}, { active: true },{viewed:{ $gt: 0 }} ] } ).sort({_id:-1})
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
};
exports.SearchWithPriceLocation = (req, res, next) => {
    console.log('req.body',req.body)
    Product.esSearch({
        query: {
            bool : {
                must : {
                    match_all : {}
                },
                filter : {
                    geo_distance : {
                        distance : "200km",
                        "location" : {
                            lat : 45.509062,
                            lon : -73.553363
                        }
                    },
                    // range: {"price": {gte: 5, lte: 500}}
                }
            }
        }
    }).then(function (results) {
        // results here
        res.status(200).json({
            message: "get product by price and location successfully!",
            result: results
        });
    });
};

exports.SearchWithName = (req, res, next) => {
    console.log('req.body',req.body)
    Product.esSearch({
        query: {
            bool: {
                must:  [
                    {"match": {"name": req.body.name}},


                ],
                // filter: {range: {"price": {gte: 121219}}}
            }
        },
        /*sort: [
            {"price": {order: "desc"}}
        ]*/
    }).then(function (results) {
        // results here
        res.status(200).json({
            message: "get product by name successfully!",
            result: results
        });
    });
};

exports.GetMinMaxPrice = (req, res, next) => {
    console.log('req.body',req.body)
    Product.esSearch({

        "aggs" : {
            "grades_stats" : { "stats" : { "field" : "price" } }
        }

    }).then(function (results) {
        // results here
        res.status(200).json({
            message: "get product by name successfully!",
            result: results
        });
    });
};

/*
exports.prodImage = (req, res, next) => {
   let formData={"photo":{
       name:req.body.name,
       type:req.body.type
   }

   };




    axios.post('https://file-upload-example-backend-dkhqoilqqn.now.sh/upload',formData).then(response=>{
        console.log(response)

        res.status(200).json({


        });
    })


};
*/
