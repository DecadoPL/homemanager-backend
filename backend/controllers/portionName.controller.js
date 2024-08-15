const PortionNameDB = require('../models/portionNameDB.model')

exports.getAllPortionNames = (req,res,next) => {
    PortionNameDB.find({},{_id:1, portionName: 1}).then(result =>{
        res.status(200).json({
            message: "Portion names fetched successfully!",
            portionNames: result
        })
    })
};

exports.savePortionName = (req,res,next) => {
    console.log(req.body)

    const portionNameData = {
        _id: req.body._id,
        portionName: req.body.portionName
    }

    let existingPortionName;

    if(portionNameData._id =="") portionNameData._id = null;

    PortionNameDB.findOne({_id: portionNameData._id})
    .then(portionName => {
        existingPortionName = portionName;
        if(portionName){
            portionName.portionName = portionNameData.portionName
            return portionName.save();
        }else{
            return new PortionNameDB(portionNameData).save();
        }
    })
    .then(savedPortionName => {
        res.status(201).json({
            message: "Portion name " + (existingPortionName ? "updated" : "added") + " successfully",
            portionNameId: savedPortionName._id
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: "Error adding/updating portion name"
        });
    });
};

exports.deletePortionNameById = (req,res,next) => {
    PortionNameDB.deleteOne({_id: req.params.id})
    .then(result => {
        if(result.deletedCount === 1){
            res.status(200).json({ message: "Portion name deleted!"});
        } else {
            res.status(404).json({ error: "Portion name not found!"});
        }
        })
    .catch(error => {
        res.status(500).json({error: "Internal server error"});
    })
};