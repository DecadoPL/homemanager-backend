const DishDB = require('../models/dishDB.model');
const DietDB = require('../models/dietDB.model');

const mongoose = require('mongoose');

exports.saveDish = (req, res, next) => {
    const dishData = {
        _id: req.body._id,
        dishName: req.body.dishName,
        dishPortions: req.body.dishPortions,
        dishRecipe: req.body.dishRecipe,
        dishIngredients: req.body.dishIngredients || [],
        dishProteinsPerPortion: req.body.dishProteinsPerPortion,
        dishCarbohydratesPerPortion: req.body.dishCarbohydratesPerPortion,
        dishFatPerPortion: req.body.dishFatPerPortion,
        dishKcalPerPortion: req.body.dishKcalPerPortion
    }

    for (let i=0; i < dishData.dishIngredients.length; i++) {
        if(dishData.dishIngredients[i]._id == null){
            dishData.dishIngredients[i]._id = new mongoose.Types.ObjectId();
        }
    }

    let existingDish;

    DishDB.findOne({_id: dishData._id})
    .then(dish => {
        existingDish = dish;
        if(dish) {
            dish.dishName = dishData.dishName,
            dish.dishPortions = dishData.dishPortions,
            dish.dishRecipe = dishData.dishRecipe,
            dish.dishIngredients = dishData.dishIngredients || [],
            dish.dishProteinsPerPortion = dishData.dishProteinsPerPortion,
            dish.dishCarbohydratesPerPortion = dishData.dishCarbohydratesPerPortion,
            dish.dishFatPerPortion = dishData.dishFatPerPortion,
            dish.dishKcalPerPortion = dishData.dishKcalPerPortion
            return dish.save();
        } else {
            return new DishDB(dishData).save();
        }
    })
    .then(savedDish => {
        if(!existingDish) {
            return res.status(201).json({
                message: "Dish added successfully",
                dishId: savedDish._id
            });
        }else{
            return DietDB.find({'dietDays.dayDishes.dishId': existingDish._id})
        }
    })
    .then(ret => { 
        if(ret != undefined && Array.isArray(ret)){
            ret.forEach(diet => {
                diet.dietDays.forEach(dietDay => {
                    dietDay.dayDishes.forEach(dish => {
                        if(dish){
                            if(dish.dishId.equals(dishData._id)){
                                dish.dishName = dishData.dishName;
                                dish.dishPortions = dishData.dishPortions;
                                dish.dietDishProteins = (dishData.dishProteinsPerPortion*dish.dietDishQuantity).toFixed(1);
                                dish.dietDishCarbohydrates = (dishData.dishCarbohydratesPerPortion*dish.dietDishQuantity).toFixed(1);
                                dish.dietDishFat = (dishData.dishFatPerPortion*dish.dietDishQuantity).toFixed(1);
                                dish.dietDishKcal = (dishData.dishKcalPerPortion*dish.dietDishQuantity).toFixed(1);
                            } 
                        }
                    })
                })
                diet.save();
            })

            if (ret.statusCode === undefined){
                res.status(201).json({
                    message: "Dish updated successfully",
                });
            }
        }

    })
    .catch(err => {
        if(err.code === 11000)
        {
            return res.status(500).json({
                message: "There is already dish with this name"
            });
        } else {
            console.log(err)
            res.status(500).json({
                message: "Error adding/updating dish"
            });
        }
    });
}

exports.getAllDishNames = (req, res, next) => {
    DishDB.find({},{_id:1, dishName:1})
    .then(result => {
        res.status(200).json({
            message: "Dishes fetched successfully!",
            dishes: result
        });
    });
};

exports.getDishById = (req, res, next) => {
    DishDB.findOne({_id: req.params.id})
    .then(result => {
        res.status(200).json({
            message: "Dish fetched successfully",
            dish: result
        });
    });
}

exports.getDishesWithStringInName = (req,res,next) => {
    DishDB.find({ dishName: { $regex: req.params.str, $options: 'i' } }, {_id: 1, dishName: 1})
    .then(result => {
        res.status(200).json({
            message: "Dishes fetched successfully",
            dishes: result
        });
    });
};

exports.deleteDishById = (req, res, next) => {
    DishDB.deleteOne({_id: req.params.id})
    .then(result => {
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Dish deleted!" });
        } else {
            res.status(404).json({ error: "Dish not found!" });
        }
        })
    .catch(error => {
        res.status(500).json({ error: "Internal server error" });
    });
}

exports.copyDishById = (req, res, next) => {
    DishDB.findOne({_id: req.params.id})
    .then(dish => {
        const copy = new DishDB({
            _id: null,
            dishName: dish.dishName+'-copy',
            dishRecipe:dish.dishRecipe,
            dishPortions:dish.dishPortions,
            dishProteinsPerPortion:dish.dishProteinsPerPortion,
            dishCarbohydratesPerPortion:dish.dishCarbohydratesPerPortion,
            dishFatPerPortion:dish.dishFatPerPortion,
            dishKcalPerPortion:dish.dishKcalPerPortion,
            dishIngredients:dish.dishIngredients,
        })
        copy.save().then(() => {
            res.status(201).json({
                message: "Dish copied successfully",
            });
        })

    }).catch(error => {
        res.status(500).json({ error: "Internal server error" });
    });

}