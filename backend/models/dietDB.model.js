const mongoose = require('mongoose');

const dietRequirementsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dietRequirementsName: {type: String, required: true},
    dietRequirementsProteins: {type: String, required: true},
    dietRequirementsCarbohydrates: {type: String, required: true},
    dietRequirementsFat: {type: String, required: true},
    dietRequirementsKcal: {type: String, required: true},
    dietRequirementsMealsTime: {type: [String], required: true},
})

const dietDishSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dietDishQuantity: {type: Number, required: true},
    dietDishTime: {type: String, required: true},
    dishId: mongoose.Schema.Types.ObjectId,
    dishName: {type: String, required: true},
    dishPortions: {type: Number, required: true},
    dietDishProteins: {type: Number, required: true}, 
    dietDishCarbohydrates: {type: Number, required: true},
    dietDishFat: {type: Number, required: true},
    dietDishKcal: {type: Number, required: true},
})

const dietDaySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dayName: {type: String, required: true},
    dayDate: {type: String, required: true},
    dayDishes: {type: [dietDishSchema], required: true},
})

const dietSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dietName: {type: String, required: true},
    dietDescription: {type: String, required: true},
    dietRequirements: {type: dietRequirementsSchema, required: true},
    dietDays: {type: [dietDaySchema], required: true},
    dietInUse: {type: Boolean, required: true},
});

module.exports = mongoose.model('Diet', dietSchema);