const { default: mongoose } = require('mongoose');
const ShoppingListDB = require('../models/shoppingListDB.model');
const DietDB = require('../models/dietDB.model');
const DishDB = require('../models/dishDB.model');

exports.dietsItemsFetch = async (req, res, next) => {
    const dietIds = req.body;

    const dishesFromDiet = await DietDB.aggregate([
        { $match: { _id: { $in: dietIds.map(id => new mongoose.Types.ObjectId(id)) } } },
        { $unwind: "$dietDays" },
        { $unwind: "$dietDays.dayDishes" },
        { $group: { _id: "$dietDays.dayDishes.dishId", totalPortions: { $sum: "$dietDays.dayDishes.dietDishQuantity" } } }
    ]);

    const dishIds = dishesFromDiet.map(dish => dish._id);
    const dishes = await DishDB.find({ _id: { $in: dishIds } });

    const aggregatedItems = dishes.flatMap(dish => {
        if(dish._id != null){
            var dishFromDiet = dishesFromDiet.find(d => d._id && d._id.equals(dish._id));
        }

        const ingredients = [...dish.dishIngredients]

        const items = ingredients.map(ingr => {
            const desiredPortionWeights = ingr.ingrPortions.filter(p => p.ingrPortionName === "pc").map(p => p.ingrPortionWeight);
            let listItem = {
                _id: ingr.ingrId,
                itemName: ingr.ingrName,
                itemWeight: ingr.dishIngrPortion.ingrPortionWeight*ingr.dishIngrQuantity*dishFromDiet.totalPortions,
                itemPC: undefined,
                itemPCWeight: ingr.ingrPortions.filter(p => p.ingrPortionName === "pc").map(p => p.ingrPortionWeight)[0],
                itemPackages: undefined,
                itemPackageWeight: ingr.ingrPortions.filter(p => p.ingrPortionName === "package").map(p => p.ingrPortionWeight)[0],
                itemChecked: false
            }
            return listItem
        })
        return items

    });

    // Sum up item weights for the same ingredients
    const ingredientMap = {};
    aggregatedItems.forEach(item => {
        const { _id, itemWeight } = item;
        if (ingredientMap[_id]) {
            ingredientMap[_id].itemWeight += item.itemWeight;
        } else {
            ingredientMap[_id] = item;
        }
    });
    // Convert object values back to array
    const ret = Object.values(ingredientMap);

    res.status(201).json({
        message: "ShoppingList items fetched successfully!",
        shoppingList: ret
    });
};

exports.saveShoppingList = (req, res, next) => {
    const shoppingListData = {
        _id: req.body._id,
        shoppingListName: req.body.shoppingListName,
        shoppingListItems: req.body.shoppingListItems
    }

    let existingShoppingList;

    ShoppingListDB.findOne({_id: shoppingListData._id})
    .then(shoppingList => {
        existingShoppingList = shoppingList;
        if(shoppingList) {
            shoppingList.shoppingListName = shoppingListData.shoppingListName
            shoppingList.shoppingListItems = shoppingListData.shoppingListItems || []

            return shoppingList.save();
        } else {
            return new ShoppingListDB(shoppingListData).save();
        }
    })
    .then(savedShoppingList=> {
        res.status(201).json({
        message: "ShoppingList " + (existingShoppingList ? "updated" : "added") + " successfully",
        shoppingListId: savedShoppingList._id
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
        message: "Error adding/updating diet"
        });
    });
}

exports.getAllShoppingListsNames = (req, res, next) => {
    ShoppingListDB.find({},{_id:1, shoppingListName:1})
    .then(result => {
        res.status(200).json({
            message: "ShoppingLists fetched successfully!",
            shoppingLists: result
        });
    });
};

exports.getShoppingListById = (req, res, next) => {
    ShoppingListDB.findOne({_id: req.params.id})
    .then(result => {
        res.status(200).json({
            message: "ShoppingList fetched successfully",
            shoppingList: result
        });
    });
}

exports.deleteShoppingListById = (req, res, next) => {
    ShoppingListDB.deleteOne({_id: req.params.id})
    .then(result => {
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "ShoppingList deleted!" });
        } else {
            res.status(404).json({ error: "ShoppingList not found!" });
        }
        })
    .catch(error => {
        res.status(500).json({ error: "Internal server error" });
    });
}