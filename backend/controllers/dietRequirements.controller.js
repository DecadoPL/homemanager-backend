const DietRequirementsDB = require('../models/dietRequirementsDB.model')

exports.saveDietRequirements = (req, res, next) => {
    const dietRequirementsData = {
        _id: req.body._id,
        dietRequirementsName: req.body.dietRequirementsName,
        dietRequirementsProteins: req.body.dietRequirementsProteins,
        dietRequirementsCarbohydrates: req.body.dietRequirementsCarbohydrates,
        dietRequirementsFat: req.body.dietRequirementsFat,
        dietRequirementsKcal: req.body.dietRequirementsKcal,
        dietRequirementsMealsTime: req.body.dietRequirementsMealsTime || [],
    }

    let existingDietRequirements;
    DietRequirementsDB.findOne({_id: dietRequirementsData._id})
    .then(dr => {
        existingDietRequirements = dr;
        if(dr){
            dr.dietRequirementsName = dietRequirementsData.dietRequirementsName
            dr.dietRequirementsProteins = dietRequirementsData.dietRequirementsProteins
            dr.dietRequirementsCarbohydrates = dietRequirementsData.dietRequirementsCarbohydrates
            dr.dietRequirementsFat = dietRequirementsData.dietRequirementsFat
            dr.dietRequirementsKcal = dietRequirementsData.dietRequirementsKcal
            dr.dietRequirementsMealsTime = dietRequirementsData.dietRequirementsMealsTime || []
            return dr.save();
        } else {
            return new DietRequirementsDB(dietRequirementsData).save();
        }
    })
    .then(savedDietRequirements => {
        res.status(201).json({
            message: "Diet requirements " + (existingDietRequirements ? "updated" : "added") + " successfully",
            dietRequirementsId: savedDietRequirements._id
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
        message: "Error adding/updating diet requirements"
        });
    })
}

exports.getAllDietRequirementsNames = (req, res, next) => {
    DietRequirementsDB.find({},{_id:1, dietRequirementsName:1})
    .then(result => {
        res.status(200).json({
            message: "Diet requirements fetched successfully!",
            dietRequirements: result
        });
    });
};

exports.getDietRequirementsById = (req, res, next) => {
    DietRequirementsDB.findOne({_id: req.params.id})
    .then(result => {
        res.status(200).json({
            message: "Diet requirements fetched successfully",
            dietRequirements: result
        });
    });
}

exports.deleteDietRequirementsById = (req, res, next) => {
    DietRequirementsDB.deleteOne({_id: req.params.id})
    .then(result => {
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Diet requirements deleted!" });
        } else {
            res.status(404).json({ error: "Diet requirements not found!" });
        }
        })
    .catch(error => {
        res.status(500).json({ error: "Internal server error" });
    });
}