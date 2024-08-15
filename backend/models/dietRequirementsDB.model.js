const mongoose = require('mongoose');

const dietRequirementsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    dietRequirementsName: {type: String, required: true},
    dietRequirementsProteins: {type: Number, required: true},
    dietRequirementsCarbohydrates: {type: Number, required: true},
    dietRequirementsFat: {type: Number, required: true},
    dietRequirementsKcal: {type: Number, required: true},
    dietRequirementsMealsTime: {type: [String], required: true},
})

module.exports = mongoose.model('DietRequirement', dietRequirementsSchema)