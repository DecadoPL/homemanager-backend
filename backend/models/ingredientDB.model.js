const mongoose = require('mongoose');

const ingredientPortionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ingrPortionNameId: mongoose.Schema.Types.ObjectId,
    ingrPortionName: {type: String, required: true},
    ingrPortionWeight: {type: Number, required: true},
});

const ingredientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ingrName: {type: String, required: true, unique: true},
    ingrProteins: {type: Number, required: true},
    ingrCarbohydrates: {type: Number, required: true},
    ingrFat: {type: Number, required: true},
    ingrKcal: {type: Number, required: true},
    ingrPortions: {type: [ingredientPortionSchema], required: true}
});

module.exports = mongoose.model('Ingredient', ingredientSchema);


