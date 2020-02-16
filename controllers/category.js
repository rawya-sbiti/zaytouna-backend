//const User = require("../Models/User");
const Category = require("../Models/Category");
const Product = require("../Models/Product");
const cloudinary = require('cloudinary');
require('../handler/cloudinary');
const upload = require('../handler/multer');
const Model = require("../Models/Models");
const Makes = require("../Models/Makes");

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


exports.createCategory= async (req,res,next)=>{
    console.log("req.bodyreq.body",req.body)
    const result = await cloudinary.v2.uploader.upload(req.body.images[0].url);
    let images=[]
    images.push(result.secure_url)

    if(req.body.undefined!="Uncategorized"){

        Category.findById(req.body.undefined).then(category=>{
            if(category){

                const Cat = new Category({
                    active: req.body.active,
                    description: req.body.description,
                    display: req.body.display,
                    images: images,
                    name:  req.body.name,
                    quantity:req.body.quantity,
                    parent    :category,
                    created_at: new Date(),


                });
                Cat.save()

                    .then(Category =>{
                        console.log("CategoryCategoryCategory",Category)
                        res.status(200).json({
                            message: "Category created successfully!",
                            result: Category
                        });
                    }).catch(handleError(res));
            }

        })

    }else{
        const Cat = new Category({
            active: req.body.active,
            description: req.body.description,
            display: req.body.display,
            images: images,
            name:  req.body.name,
            quantity:req.body.quantity,
            created_at: new Date(),
            parent    :null

        });
        Cat.save()

            .then(Category =>{
                console.log("CategoryCategoryCategory",Category)
                res.status(200).json({
                    message: "Category created successfully!",
                    result: Category
                });
            }).catch(handleError(res));
    }





};

exports.deleteCategoryById = (req, res, next) => {

    return Category.findById(req.params.id).exec()
        .then(entity => {

            entity.remove()
                .then(entity =>{

                    Category.find({id: {$ne: req.params.id}}).sort({_id:-1})
                        .exec()
                        .then(respondWithResult(res))
                })
                .catch(handleError(res));
        })



};


exports.activeCategory = (req, res, next) => {
    return Category.updateOne({_id:req.params.id},   { $set: { "active": true } }).exec()

        .then(entity =>{

            Category.find().sort({_id:-1})
                .exec()
                .then(respondWithResult(res))
        })
        .catch(handleError(res));

};

exports.disactiveCategory = (req, res, next) => {
    return Category.updateOne({_id: req.params.id},{ $set: { "active": false } }).exec()

        .then(entity =>{

            Category.find().sort({_id:-1})
                .exec()
                .then(respondWithResult(res))
        })
        .catch(handleError(res));

};



exports.AllCategories=(req,res,next)=>{

    return Category.find().sort({_id:-1})
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));

}
exports.CategorieAddpost=(req,res,next)=>{

    return Category.find().sort({_id:1}).exec()

        .then((result)=>{
                let array=[];
                let subcat=[];
                for(let i=0;i<result.length;i++){
                    if(result[i].parent == null){
                        let object={}
                        object.label=result[i].name
                        object.value=result[i]._id
                        array.push(object)
                    }else
                        if(result[i].parent._id !=null){

                        let object={}
                       // object.label=result[i].name
                        //object.value=result[i]._id
                        subcat.push(result[i])
                    }

                }
            
            res.status(200).json({
                message: "successfully!",
                cat: array,
                subCat:subcat,
                allCat:result
            })
        })
        .catch(handleError(res));

}

exports.UpdateCategory = (req, res, next) => {
            console.log("req.bodyreq.body",req.body)
    Category.findById(req.body._id).then(category=>{
        if(category){
            if(req.body.undefined === null ){

                Category.findById(req.body.parent._id).then(categoryParent=>{

                    category.name = req.body.name;
                    category.display = req.body.display;
                    category.parent= categoryParent;

                    return category.save().then(respondWithResult(res))
                        .catch(handleError(res));

                })



            }else if( req.body.undefined === "Uncategorized"){




                category.name = req.body.name;
                category.display = req.body.display;
                category.parent= null;

                return category.save().then(respondWithResult(res))
                    .catch(handleError(res));

            }else{
                Category.findById(req.body.undefined).then(categoryParent=>{

                    category.name = req.body.name;
                    category.display = req.body.display;
                    category.parent= categoryParent;

                    return category.save().then(respondWithResult(res))
                        .catch(handleError(res));

                })

            }

        }

    }).catch(handleError(res));

};




exports.getCategoryParent = (req, res, next) => {
    console.log('req.body',req.body)
    return Category.find({"parent" : null })
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));

};

exports.getCategoryById = (req, res, next) => {
    console.log('req.body',req.body)
    return Category.findById(req.body.categoriesId)
        .exec()
        .then(respondWithResult(res))
        .catch(handleError(res));

};

exports.getProductsByCategoryId = (req, res, next) => {
    let myproducts =[];
    console.log("bodyyyyy",req.body)
    Category.findById(req.body.id).then( cat => {
        if(cat){
            //  console.log(user)

            Product.find().sort({_id:-1}).then( products => {
                if(products){
                    //  console.log(recharges)
                    products.map(e => {
                         if(e.category)
                        if(e.category.id === cat.id ){
                          //  console.log(e)
                            myproducts.push(e)

                        }
                    })
                    res.status(200).json({
                        message: "My Products by category Id  !!!! ",
                        result: myproducts ,
                    });

                }
            })
        }
    }).catch(handleError(res));

};

exports.getSubCategoriesByCategoryId = (req, res, next) => {
    console.log("bodyyyyyyyyy",req.body)
    let mySubCats =[];

    Category.findById(req.body.category).then( cat => {
        if(cat){
           //  console.log(cat)

            Category.find().sort({_id:-1}).then( categories => {
                if(categories){
                  //  console.log("catssss",categories)
                    categories.map(e => {

if(e.parent !== null){
    console.log("perent ",e)
    console.log("id parent e",e.parent._id)
    console.log("parent id selected",req.body._id)

    if((e.parent._id).toString() === (req.body.category).toString() ){
        console.log("parent not null")
        console.log(cat.id)


        mySubCats.push(e)

    }
}




                    })
                    res.status(200).json({
                        message: "My sub-Categories by category Id  !!!! ",
                        result: mySubCats ,
                    });

                }
            })
        }
    }).catch(handleError(res));

};



exports.getSubCategoriesByCategoryIdP = (req, res, next) => {
    console.log("bodyyyyyyyyy",req.body)
    let mySubCats =[];

    Category.findById(req.body._id).then( cat => {
        if(cat){
            //  console.log(cat)

            Category.find().sort({_id:-1}).then( categories => {
                if(categories){
                    //  console.log("catssss",categories)
                    categories.map(e => {

                        if(e.parent !== null){
                            console.log("perent ",e)
                            console.log("id parent e",e.parent._id)
                            console.log("parent id selected",req.body._id)

                            if((e.parent._id).toString() === (req.body._id).toString() ){
                                console.log("parent not null")
                                console.log(cat.id)


                                mySubCats.push(e)

                            }
                        }




                    })
                    res.status(200).json({
                        message: "My sub-Categories by category Id  !!!! ",
                        result: mySubCats ,
                    });

                }
            })
        }
    }).catch(handleError(res));

};
exports.CatModel = (req, res, next) => {
    const Cat = new Category({
        active: true,
        description: "",
        display: "Products",
        //images: images,
        name:  "RS5",
        quantity:0,
        parent    :
            {
                "quantity": 0,
                "images": [
                    "https://res.cloudinary.com/azertysoft/image/upload/v1570021105/ayyk0lg6grs6as7gpzue.jpg"
                ],
                "_id": "5d949ef187e53604238a3296",
                "active": true,
                "description": "",
                "display": "Products",
                "name": "Audi",
                "parent": {
                    "quantity": 0,
                    "images": [
                        "https://res.cloudinary.com/azertysoft/image/upload/v1569937618/kalgt69epnciayugdo7w.jpg"
                    ],
                    "_id": "5d9358d39ffbe4166349c8a2",
                    "active": true,
                    "description": "",
                    "display": "Products",
                    "name": "Make",
                    "parent": {
                        "quantity": 2,
                        "images": [
                            "https://res.cloudinary.com/azertysoft/image/upload/v1569917400/hjh2bcoeuzgkjfb9rvex.jpg"
                        ],
                        "_id": "5d9309d84a81d71201d37ec1",
                        "active": true,
                        "description": "",
                        "display": "Products",
                        "name": "Auto et camion",
                        "parent": {
                            "quantity": 0,
                            "images": [
                                "https://res.cloudinary.com/azertysoft/image/upload/v1569917362/zsl2vjcr0aopaqxf5zw0.jpg"
                            ],
                            "_id": "5d9309b24a81d71201d37ebd",
                            "active": true,
                            "description": "",
                            "display": "Subcategories",
                            "name": "Automobile",
                            "created_at": "2019-10-01T08:09:22.817Z",
                            "parent": null,
                            "__v": 0
                        },
                        "created_at": "2019-10-01T08:10:00.990Z",
                        "__v": 0
                    },
                    "created_at": "2019-10-01T13:46:59.926Z",
                    "__v": 0
                },
                "created_at": "2019-10-02T12:58:25.577Z",
                "__v": 0
            },
        created_at: new Date(),

    });
    Cat.save()

        .then(Category =>{
            console.log("CategoryCategoryCategory",Category)
            res.status(200).json({
                message: "Category created successfully!",
                result: Category
            });
        }).catch(handleError(res));

};
/*
exports.AllCategoryMakes=(req,res,next)=>{

    return Category.find({"parent._id":'5d9358d39ffbe4166349c8a2'}).sort({_id:1}).exec()
        .then((entity)=>{

                   for(let i=0;i<entity.length;i++){
                       Makes.find({make:entity[i].name}).sort({_id:1}).exec()
                           .then((result)=>{
                               for(let j=0;j<result.length;j++){
                                 Model.find({make_id:result[j]._id}).sort({_id:1}).exec()
                                     .then((value)=>{
                                     console.log("valuevaluevaluevalue",value)
                                        for(let k=0;k<value.length;k++){
                                            const Cat = new Category({
                                                active: true,
                                                description: "",
                                                display: "Products",
                                               // images: images,
                                                name:  value[k].model,
                                                quantity:0,
                                                parent    :entity[i],
                                                created_at: new Date(),


                                            });
                                            Cat.save()
                                                .then(Category =>{
                                                    console.log("CategoryCategoryCategory",Category)
                                                    res.status(200).json({
                                                        message: "Category created successfully!",
                                                        //result: Category
                                                    });
                                                }).catch(handleError(res));
                                        }

                                     })
                               }
                         //  console.log("resultresultresultresult",result.length)
                           })

                   }
            //console.log("entityentityentityentity",entity.length)
        })
        .catch(handleError(res));

    /!*  return Makes.find().exec()
          .then((entity)=>{
                  //console.log("entityentity",entity[0].make_id)
              for(let i=0; i<entity.length;i++){
                      Model.find({"make_id":entity[i].make_id }).exec()
                          .then((result)=>{
                              console.log("resultresultresult",result)
                              for(let j=0;j<result.length;j++){
                                  Model.updateOne({_id: result[j]._id},{ $set: {"make_id":entity[i]._id} }).exec()
                              }
                                /!*   Model.updateMany({_id: result[i]._id},{ $set: {"make_id":entity[0]._id} }).exec()
                                 // Model.findOneAndUpdate({"make_id":entity[0]._id}).exec()
                                      .then((update)=>{

                                          res.status(200).json({
                                              message: "Claim created successfully!",
                                              result: update
                                          });
                                      })
                              }*!/

                         // console.log("resultresultresult",result)
                          })

              }
             // Model.find()


          })
          .catch(handleError(res));*!/

}
*/




/*

exports.getClaim = ( req, res, next) =>{
    var id = req.body.id;
    console.log("user claim id ",req.body  )

    Claim.findById(id)
        .exec().then((claim) =>{
        if (claim){
            console.log(claim)
                User.findById(claim.user._id).exec().then(user =>{
                if(user){
                    console.log(user)
                    claim.user.balance = user.balance;
                    return    claim.save().then(respondWithResult(res)).catch(handleError(res));
                }
            })
        }
        }).catch(handleError(res));
};








*/

