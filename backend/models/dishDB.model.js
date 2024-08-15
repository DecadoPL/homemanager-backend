const mongoose = require('mongoose');

const ingredientPortionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ingrPortionNameId: mongoose.Schema.Types.ObjectId,
    ingrPortionName: {type: String, required: true},
    ingrPortionWeight: {type: Number, required: true},
});

const dishIngredientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dishIngrPortion: {type: ingredientPortionSchema, required: true},
    dishIngrQuantity: {type: Number, required: true},
        ingrId: mongoose.Schema.Types.ObjectId,
        ingrName: {type: String, required: true },
        ingrProteins: {type: Number, required: true},
        ingrCarbohydrates: {type: Number, required: true},
        ingrFat: {type: Number, required: true},
        ingrKcal: {type: Number, required: true},
        ingrPortions: {type: [ingredientPortionSchema], required: true}    
});

const dishSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dishName: {type: String, required: true, unique: true},
    dishRecipe: {type: String, required: false},
    dishPortions: {type: Number, required: true},
    dishProteinsPerPortion: {type: Number, required: true},
    dishCarbohydratesPerPortion: {type: Number, required: true},
    dishFatPerPortion: {type: Number, required: true},
    dishKcalPerPortion: {type: Number, required: true},
    dishIngredients: {type: [dishIngredientSchema], required: true}
});

module.exports = mongoose.model('Dish', dishSchema);