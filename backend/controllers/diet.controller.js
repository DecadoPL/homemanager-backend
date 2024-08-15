const { default: mongoose } = require('mongoose');
const DietDB = require('../models/dietDB.model');

exports.saveDiet = (req, res, next) => {
    const dietData = {
        _id: req.body._id,
        dietName: req.body.dietName,
        dietDescription: req.body.dietDescription,
        dietRequirements: req.body.dietRequirements,
        dietDays: req.body.dietDays,
        dietInUse: req.body.dietInUse
    }
    for (let i=0; i < dietData.dietDays.length; i++) {
        if(dietData.dietDays[i]._id == null){
            dietData.dietDays[i]._id = new mongoose.Types.ObjectId();
            for(let j=0; j < dietData.dietDays[i].dayDishes.length; j++){
                if(dietData.dietDays[i].dayDishes[j] != null){
                    if(dietData.dietDays[i].dayDishes[j]._id == null){
                        dietData.dietDays[i].dayDishes[j]._id = new mongoose.Types.ObjectId();
                    }
                }
                
            }
        }
    }

    let existingDiet;
    DietDB.findOne({_id: dietData._id})
    .then(diet => {
        existingDiet = diet;
        if(diet) {
            diet.dietName = dietData.dietName
            diet.dietDescription = dietData.dietDescription
            diet.dietRequirements = dietData.dietRequirements
            diet.dietDays = dietData.dietDays || []
            diet.dietInUse = dietData.dietInUse || false
            return diet.save();
        } else {
            return new DietDB(dietData).save();
        }
    })
    .then(savedDiet=> {
        res.status(201).json({
        message: "Diet " + (existingDiet ? "updated" : "added") + " successfully",
        dietId: savedDiet._id
        });
    })
    .catch(err => {
        res.status(500).json({
        message: "Error adding/updating diet"
        });
    });
}

exports.getAllDietsNames = (req, res, next) => {
    DietDB.find({},{_id:1, dietName:1, dietInUse:1})
    .then(result => {
        res.status(200).json({
            message: "Diets fetched successfully!",
            diets: result
        });
    });
};

exports.getDietById = (req, res, next) => {
    DietDB.findOne({_id: req.params.id})
    .then(result => {
        res.status(200).json({
            message: "Diet fetched successfully",
            diet: result
        });
    });
}

exports.deleteDietById = (req, res, next) => {
    DietDB.deleteOne({_id: req.params.id})
    .then(result => {
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Diet deleted!" });
        } else {
            res.status(404).json({ error: "Diet not found!" });
        }
        })
    .catch(error => {
        res.status(500).json({ error: "Internal server error" });
    });
}

exports.copyDietById = (req, res, next) => {
    DietDB.findOne({_id: req.params.id})
    .then(diet => {
        const copy = new DietDB({
            _id: null,
            dietName: diet.dietName,
            dietDescription: diet.dietDescription,
            dietRequirements: diet.dietRequirements,
            dietDays: diet.dietDays,
            dietInUse: diet.dietInUse
        })
        copy.save().then(() => {
            res.status(201).json({
                message: "Diet copied successfully",
            });
        })

    }).catch(error => {
        res.status(500).json({ error: "Internal server error" });
    });

}