const mongoose = require('mongoose');

const portionNameSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
    portionName: {type: String, required: [true, "The portion name is missing"], unique: [true, "The portion name already exists"]}
});

module.exports = mongoose.model('PortionName', portionNameSchema);